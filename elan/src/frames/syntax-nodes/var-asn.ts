import { ArrayType } from "../../symbols/array-type";
import { ClassDefinitionType } from "../../symbols/class-definition-type";
import { ClassType } from "../../symbols/class-type";
import { FunctionType } from "../../symbols/function-type";
import { ListType } from "../../symbols/list-type";
import { SymbolScope } from "../../symbols/symbol";
import { ISymbolType } from "../../symbols/symbol-type";
import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AbstractAstNode } from "./abstract-ast-node";
import { AstNode } from "./ast-node";
import { IndexAsn } from "./index-asn";
import { RangeAsn } from "./range-asn";

export class VarAsn extends AbstractAstNode implements AstNode {

    constructor(public readonly id: string, public readonly qualifier: AstNode | undefined, private readonly index: AstNode | undefined, public readonly fieldId: string, private scope: Scope) {
        super();
    }

    aggregateCompileErrors(): CompileError[] {
        const q = this.qualifier ? this.qualifier.aggregateCompileErrors() : [];
        const i = this.index ? this.index.aggregateCompileErrors() : [];

        return this.compileErrors
            .concat(q)
            .concat(i);
    }

    private isRange() {
        return this.index instanceof IndexAsn && this.index.index instanceof RangeAsn;
    }

    private isIndex() {
        return this.index instanceof IndexAsn && !(this.index.index instanceof RangeAsn);
    }

    private getQualifier() {
        if (this.qualifier) {
            return `${this.qualifier.compile()}`;
        }
        const s = this.scope.resolveSymbol(this.id, this.scope);

        if (s && s.symbolScope === SymbolScope.property) {
            return "this.";
        }

        return "";
    }

    wrapListOrArray(rootType: ISymbolType, code: string): string {
        if (rootType instanceof ListType) {
            return `system.list(${code})`;
        }
        if (rootType instanceof ArrayType) {
            return `system.array(${code})`;
        }
        if (rootType instanceof FunctionType) {
            return this.wrapListOrArray(rootType.returnType, code);
        }
        return code;
    }

    compile(): string {
        this.compileErrors = [];
        var q = this.getQualifier();
        var idx = this.index ? this.index.compile() : "";
        var code = `${q}${this.id}${idx}`;

        if (this.isRange()) {
            const rootType = this.scope.resolveSymbol(this.id, this.scope)?.symbolType;
            if (rootType) {
                code = this.wrapListOrArray(rootType, code);
            }
        }

        return code;
    }

    get symbolType() {
        var currentScope = this.scope;
        const classScope = this.qualifier ? this.qualifier.symbolType : undefined;
        if (classScope instanceof ClassType) {
            const s = this.scope.resolveSymbol(classScope.className, this.scope);
            // replace scope with class scope
            currentScope = s as unknown as Scope;
        }

        const rootType = currentScope.resolveSymbol(this.id, currentScope)?.symbolType;
        if (this.isIndex() && rootType instanceof ListType) {
            return rootType.ofType;
        }
        return rootType;
    }

    get symbolScope() {
        var currentScope = this.scope;
        const classScope = this.qualifier ? this.qualifier.symbolType : undefined;
        if (classScope instanceof ClassDefinitionType) {
            const s = this.scope.resolveSymbol(classScope.className, this.scope);
            // replace scope with class scope
            currentScope = s as unknown as Scope;
        }

        const symbol = currentScope.resolveSymbol(this.id, currentScope)!;
      
        return symbol.symbolScope;
    }

    toString() {
        const q = this.qualifier ? `${this.qualifier}` : "";
        const idx = this.index ? `${this.index}` : "";
        return `${q}${this.id}${idx}`;
    }
}