import { CompileError } from "../compile-error";
import {
  mustBeKnownSymbol,
  mustBePureFunctionSymbol,
  mustCallExtensionViaQualifier,
  mustMatchParameters,
} from "../compile-rules";
import { AstIdNode } from "../interfaces/ast-id-node";
import { AstNode } from "../interfaces/ast-node";
import { Scope } from "../interfaces/scope";
import { FunctionType } from "../symbols/function-type";
import { scopePrefix, updateScopeAndQualifier } from "../symbols/symbol-helpers";
import { AbstractAstNode } from "./abstract-ast-node";
import { containsGenericType, generateType, matchGenericTypes, transforms } from "./ast-helpers";
import { QualifierAsn } from "./qualifier-asn";

export class FuncCallAsn extends AbstractAstNode implements AstIdNode {
  constructor(
    public readonly id: string,
    private readonly qualifier: AstNode | undefined,
    private readonly parameters: Array<AstNode>,
    public readonly fieldId: string,
    private readonly scope: Scope,
  ) {
    super();
    this.id = id.trim();
  }

  get mId() {
    return this.id;
  }

  aggregateCompileErrors(): CompileError[] {
    let cc: CompileError[] = [];

    for (const i of this.parameters) {
      cc = cc.concat(i.aggregateCompileErrors());
    }

    if (this.qualifier) {
      cc.concat(this.qualifier.aggregateCompileErrors());
    }

    return this.compileErrors.concat(cc);
  }

  compile(): string {
    this.compileErrors = [];

    let parameters = [...this.parameters];
    const [updatedQualifier, currentScope] = updateScopeAndQualifier(
      this,
      transforms(),
      this.scope,
    );

    const funcSymbol = currentScope.resolveSymbol(this.id, transforms(), this.scope);
    const fst = funcSymbol.symbolType(transforms());
    let qualifier = updatedQualifier;
    let isAsync: boolean = false;

    mustBeKnownSymbol(funcSymbol, this.compileErrors, this.fieldId);
    mustBePureFunctionSymbol(fst, this.scope, this.compileErrors, this.fieldId);

    if (fst instanceof FunctionType) {
      mustCallExtensionViaQualifier(fst, qualifier, this.compileErrors, this.fieldId);

      if (fst.isExtension && qualifier instanceof QualifierAsn) {
        parameters = [qualifier.value as AstNode].concat(parameters);
        qualifier = undefined;
      }

      let parameterTypes = fst.parametersTypes;

      if (parameterTypes.some((pt) => containsGenericType(pt))) {
        // this.parameters is correct - function adds qualifier if extension
        const matches = matchGenericTypes(fst, this.parameters, this.qualifier);
        parameterTypes = parameterTypes.map((pt) => generateType(pt, matches));
      }

      mustMatchParameters(
        parameters,
        parameterTypes,
        fst.isExtension,
        this.compileErrors,
        this.fieldId,
      );

      isAsync = fst.isAsync;
    }

    const a = isAsync ? "await " : "";
    const pp = parameters.map((p) => p.compile()).join(", ");
    const q = qualifier ? `${qualifier.compile()}` : scopePrefix(funcSymbol?.symbolScope);
    return q ? `${a}${q}${this.id}(${pp})` : `${this.mId}(${pp})`;
  }

  symbolType() {
    const [updatedQualifier, currentScope] = updateScopeAndQualifier(
      this,
      transforms(),
      this.scope,
    );

    const funcSymbol = currentScope.resolveSymbol(this.id, transforms(), this.scope);
    const fst = funcSymbol.symbolType(transforms());

    if (fst instanceof FunctionType) {
      const returnType = fst.returnType;

      if (containsGenericType(returnType)) {
        const matches = matchGenericTypes(fst, this.parameters, this.qualifier);
        return generateType(returnType, matches);
      }
      return returnType;
    }

    return fst;
  }

  toString() {
    const pp = this.parameters.map((p) => p.toString()).join(", ");
    const q = this.qualifier ? `${this.qualifier}` : "";
    return `Func Call ${q}${this.id} (${pp})`;
  }
}
