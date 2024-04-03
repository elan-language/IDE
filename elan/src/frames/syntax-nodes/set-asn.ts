import { BooleanType } from "../../symbols/boolean-type";
import { Field } from "../interfaces/field";
import { AstNode } from "./ast-node";
import { ExprAsn } from "./expr-asn";


export class SetAsn implements AstNode {

    constructor(private id: string, private to: ExprAsn, field: Field) {
        this.id = id.trim();
    }

    get symbolType() {
        return this.to.symbolType;
    }

    toString() {
        return `Set (${this.id}) (${this.to})`;
    }
}