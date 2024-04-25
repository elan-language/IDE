import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AstNode } from "./ast-node";
import { ExprAsn } from "./expr-asn";

export class InterpolatedAsn implements AstNode {

    constructor(private body: ExprAsn, private scope: Scope) {
    }

    compileErrors: CompileError[] = [];

    aggregateCompileErrors(): CompileError[] {
        return this.compileErrors
        .concat(this.body.aggregateCompileErrors());
    }

    compile(): string {
        return `\${_stdlib.asString(${this.body.compile()})}`;
    }

    get symbolType() {
        return this.body.symbolType;
    }

    toString() {
        return `(${this.body})`;
    }
}