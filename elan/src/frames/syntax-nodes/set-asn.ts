import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AstNode } from "./ast-node";
import { ExprAsn } from "./expr-asn";


export class SetAsn implements AstNode {

    constructor(private id: string, private to: ExprAsn, scope: Scope) {
        this.id = id.trim();
    }

    compileErrors: CompileError[] = [];

    aggregateCompileErrors(): CompileError[] {
        throw new Error("Method not implemented.");
    }

    compile(): string {
        return `${this.id} = ${this.to}`;
    }

    get symbolType() {
        return this.to.symbolType;
    }

    toString() {
        return `Set (${this.id}) (${this.to})`;
    }
}