import { CompileError } from "../compile-error";
import {
  mustBeCompatibleType,
  mustBeIndexableSymbol,
  mustBeKnownSymbol,
  mustBePublicProperty,
  mustBeRangeableSymbol,
} from "../compile-rules";
import { isScope } from "../helpers";
import { AstIndexableNode } from "../interfaces/ast-indexable-node";
import { AstQualifierNode } from "../interfaces/ast-qualifier-node";
import { Frame } from "../interfaces/frame";
import { Scope } from "../interfaces/scope";
import { ElanSymbol } from "../interfaces/symbol";
import { SymbolType } from "../interfaces/symbol-type";
import { globalKeyword } from "../keywords";
import { LetStatement } from "../statements/let-statement";
import { AbstractDictionaryType } from "../symbols/abstract-dictionary-type";
import { ArrayListType } from "../symbols/array-list-type";
import { ClassType } from "../symbols/class-type";
import { FunctionType } from "../symbols/function-type";
import { ImmutableListType } from "../symbols/immutable-list-type";
import { IntType } from "../symbols/int-type";
import { StringType } from "../symbols/string-type";
import {
  getClassScope,
  getGlobalScope,
  getParentScope,
  isDictionarySymbolType,
  isGenericSymbolType,
} from "../symbols/symbol-helpers";
import { SymbolScope } from "../symbols/symbol-scope";
import { UnknownSymbol } from "../symbols/unknown-symbol";
import { UnknownType } from "../symbols/unknown-type";
import { AbstractAstNode } from "./abstract-ast-node";
import { isAstIdNode, transforms } from "./ast-helpers";
import { IndexAsn } from "./index-asn";
import { QualifierAsn } from "./qualifier-asn";
import { RangeAsn } from "./range-asn";
import { ThisAsn } from "./this-asn";

export class VarAsn extends AbstractAstNode implements AstIndexableNode {
  constructor(
    public readonly id: string,
    public readonly isAssignable: boolean,
    public readonly qualifier: AstQualifierNode | undefined,
    private readonly index: IndexAsn | undefined,
    public readonly fieldId: string,
    private scope: Scope,
  ) {
    super();
  }

  aggregateCompileErrors(): CompileError[] {
    const q = this.qualifier ? this.qualifier.aggregateCompileErrors() : [];
    const i = this.index ? this.index.aggregateCompileErrors() : [];

    return this.compileErrors.concat(q).concat(i);
  }

  isRange() {
    return this.index instanceof IndexAsn && this.index.index1 instanceof RangeAsn;
  }

  isIndex() {
    return this.index instanceof IndexAsn && !(this.index.index1 instanceof RangeAsn);
  }

  isDoubleIndex() {
    return this.isIndex() && this.index!.isDoubleIndex();
  }

  private getQualifier() {
    if (this.qualifier) {
      return `${this.qualifier.compile()}`;
    }
    const s = this.scope.resolveSymbol(this.id, transforms(), this.scope);

    if (s && s.symbolScope === SymbolScope.property) {
      return "this.";
    }

    return "";
  }

  wrapListOrArray(rootType: SymbolType, code: string): string {
    if (rootType instanceof ImmutableListType) {
      return `system.immutableList(${code})`;
    }
    if (rootType instanceof ArrayListType) {
      return `system.array(${code})`;
    }
    if (rootType instanceof FunctionType) {
      return this.wrapListOrArray(rootType.returnType, code);
    }
    return code;
  }

  wrapIndex(code: string): string {
    if (this.isDoubleIndex()) {
      return `system.safeDoubleIndex(${code})`;
    }
    return `system.safeIndex(${code})`;
  }

  getIndexType(rootType: SymbolType): [SymbolType, SymbolType] {
    if (isGenericSymbolType(rootType)) {
      return [IntType.Instance, rootType.ofType];
    }
    if (isDictionarySymbolType(rootType)) {
      return [rootType.keyType, rootType.valueType];
    }
    return [UnknownType.Instance, UnknownType.Instance];
  }

  compileIndex(rootType: SymbolType, index: IndexAsn, q: string, call: string, idx: string) {
    if (this.isDoubleIndex()) {
      const [indexType, ofType] = this.getIndexType(rootType);

      mustBeIndexableSymbol(ofType, true, this.compileErrors, this.fieldId);
      mustBeCompatibleType(indexType, index.index1.symbolType(), this.compileErrors, this.fieldId);

      const [indexType1] = this.getIndexType(ofType);

      mustBeCompatibleType(
        indexType1,
        index.index2!.symbolType(),
        this.compileErrors,
        this.fieldId,
      );
    } else {
      mustBeIndexableSymbol(rootType, true, this.compileErrors, this.fieldId);
      const [indexType] = this.getIndexType(rootType);
      mustBeCompatibleType(indexType, index.index1.symbolType(), this.compileErrors, this.fieldId);
    }

    let code = `${q}${this.id}${call}, ${idx}`;
    if (!this.isAssignable) {
      code = this.wrapIndex(code);
    }
    return code;
  }

  compile(): string {
    this.compileErrors = [];
    let symbol: ElanSymbol = new UnknownSymbol(this.id);

    const classScope = this.qualifier ? this.qualifier.symbolType() : undefined;
    if (classScope instanceof ClassType) {
      const classSymbol = this.scope.resolveSymbol(classScope.className, transforms(), this.scope);
      if (isScope(classSymbol)) {
        symbol = classSymbol.resolveSymbol(this.id, transforms(), classSymbol);
        mustBePublicProperty(symbol, this.compileErrors, this.fieldId);
      }
    } else if (isAstIdNode(this.qualifier?.value) && this.qualifier.value.id === globalKeyword) {
      symbol = getGlobalScope(this.scope).resolveSymbol(this.id, transforms(), this.scope);
    } else {
      symbol = getParentScope(this.scope).resolveSymbol(this.id, transforms(), this.scope);
    }

    mustBeKnownSymbol(symbol, this.compileErrors, this.fieldId);

    const q = this.getQualifier();
    const call = symbol instanceof LetStatement ? "()" : "";
    const idx = this.index ? this.index.compile() : "";
    let code = `${q}${this.id}${call}${idx}`;

    if (this.isIndex() || this.isRange()) {
      const rootType = this.scope
        .resolveSymbol(this.id, transforms(), this.scope)
        .symbolType(transforms());

      if (this.isIndex()) {
        code = this.compileIndex(rootType, this.index!, q, call, idx);
      }
      if (this.isRange()) {
        mustBeRangeableSymbol(rootType, true, this.compileErrors, this.fieldId);
        const [indexType] = this.getIndexType(rootType);
        mustBeCompatibleType(indexType, IntType.Instance, this.compileErrors, this.fieldId);
        code = this.wrapListOrArray(rootType, code);
      }
    }

    return code;
  }

  updateScope(currentScope: Scope) {
    const classScope = this.qualifier ? this.qualifier.symbolType() : undefined;
    if (classScope instanceof ClassType) {
      const s = this.scope.resolveSymbol(classScope.className, transforms(), this.scope);
      // replace scope with class scope
      currentScope = isScope(s) ? s : currentScope;
    } else if (classScope instanceof ClassType) {
      currentScope = classScope;
    } else if (this.qualifier instanceof QualifierAsn && this.qualifier?.value instanceof ThisAsn) {
      currentScope = getClassScope(currentScope as Frame);
    } else if (isAstIdNode(this.qualifier?.value) && this.qualifier.value.id === globalKeyword) {
      currentScope = getGlobalScope(currentScope);
    } else {
      currentScope = getParentScope(currentScope);
    }

    return currentScope;
  }

  rootSymbolType() {
    const currentScope = this.updateScope(this.scope);
    const rootType = currentScope
      .resolveSymbol(this.id, transforms(), this.scope)
      .symbolType(transforms());
    return rootType;
  }

  getOfType(rootType: SymbolType) {
    if (rootType instanceof ImmutableListType || rootType instanceof ArrayListType) {
      return rootType.ofType;
    }

    if (rootType instanceof AbstractDictionaryType) {
      return rootType.valueType;
    }

    if (rootType instanceof StringType) {
      return rootType;
    }

    return UnknownType.Instance;
  }

  symbolType() {
    const rootType = this.rootSymbolType();
    if (this.isDoubleIndex()) {
      return this.getOfType(this.getOfType(rootType));
    }
    if (this.isIndex()) {
      return this.getOfType(rootType);
    }
    return rootType;
  }

  get symbolScope() {
    const currentScope = this.updateScope(this.scope);
    const symbol = currentScope.resolveSymbol(this.id, transforms(), this.scope);
    return symbol.symbolScope;
  }

  toString() {
    const q = this.qualifier ? `${this.qualifier}` : "";
    const idx = this.index ? `${this.index}` : "";
    return `${q}${this.id}${idx}`;
  }
}
