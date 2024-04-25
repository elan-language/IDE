import { ListType } from "../../symbols/list-type";
import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AstNode } from "./ast-node";

export class LiteralListAsn implements AstNode {

    constructor(public readonly items: AstNode[], scope: Scope) {
    }

    compileErrors: CompileError[] = [];

    aggregateCompileErrors(): CompileError[] {
        throw new Error("Method not implemented.");
    }

    compile(): string {
        const it = this.items.map(p => p.compile()).join(", ");
        return `system.list([${it}])`;
    }

    get symbolType() {
        return new ListType(this.items[0].symbolType!);
    }

    toString() {
        const it = this.items.map(p => p.toString()).join(", ");
        return `[${it}]`;
    }
}