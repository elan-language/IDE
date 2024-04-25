import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AstNode } from "./ast-node";
import { ExprAsn } from "./expr-asn";
import { LambdaSigAsn } from "./lambda-sig-asn";

export class LambdaAsn implements AstNode {

    constructor(private signature: LambdaSigAsn, private body: ExprAsn, private scope: Scope) {
    }

    compileErrors: CompileError[] = [];

    aggregateCompileErrors(): CompileError[] {
        throw new Error("Method not implemented.");
    }

    compile(): string {
        throw new Error("Method not implemented.");
    }

    get symbolType() {
        return this.body.symbolType;
    }

    toString() {
        return `Lambda (${this.signature}) => (${this.body})`;
    }
}