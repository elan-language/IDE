import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { CSV } from "./csv";
import { ExprNode } from "./expr-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

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
        return UnknownType.Instance;
    }
    
}