import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { CSV } from "./csv";
import { ExprNode } from "./expr-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { TupleType } from "../../symbols/TupleType";

export class TupleDefNode extends AbstractSequence {
    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Symbol(`(`, this.field));
            this.elements.push(new CSV(() => new ExprNode(this.field),2, this.field));
            this.elements.push(new Symbol(`)`, this.field));
            super.parseText(text);
        }
    }

    get symbolType() {
        const types = (this.elements[1] as CSV).symbolTypes.map(e => e ?? UnknownType.Instance);
        return new TupleType(types);
    }
    
}