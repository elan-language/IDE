import { Scope } from "../interfaces/scope";
import { Frame } from "../interfaces/frame";
import { AstNode } from "./ast-node";
import { ExprAsn } from "./expr-asn";

export class FuncCallAsn {

    constructor(private id: string, private qualifier: AstNode | undefined, private parameters: Array<ExprAsn>, private scope : Scope) {
        this.id = id.trim();
    }

    get symbolType() {
      
        return this.scope.resolveSymbol(this.id, this.scope).symbolType;
    }

    toString() {
        const pp = this.parameters.map(p => p.toString()).join(", ");
        const q = this.qualifier ? `${this.qualifier}.` : "";
        return `Func Call ${q}${this.id} (${pp})`;
    }
}