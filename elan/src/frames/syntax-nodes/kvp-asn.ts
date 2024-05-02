import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AbstractAstNode } from "./abstract-ast-node";
import { AstNode } from "./ast-node";

export class KvpAsn extends AbstractAstNode implements AstNode {

    constructor(private readonly key: AstNode, private readonly value: AstNode, public readonly fieldId: string, scope: Scope) {
        super();
    }

    aggregateCompileErrors(): CompileError[] {
        return this.compileErrors
            .concat(this.key.aggregateCompileErrors())
            .concat(this.value.aggregateCompileErrors());
    }

    compile(): string {
        this.compileErrors = [];
        return `${this.key.compile()} : ${this.value.compile()}`;
    }

    get keySymbolType() {
        return this.key.symbolType;
    }

    get symbolType() {
        return this.value.symbolType;
    }

    toString() {
        return `(${this.key}:${this.value})`;
    }
}