import { ExprNode } from "./expr-node";
import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class BracketedExpression extends AbstractSequence {
    
    constructor(field : Field) {
        super(field);
        this.placeholder = "";
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Symbol("(", this.field));
            this.elements.push(new ExprNode(this.field));
            this.elements.push(new Symbol(")", this.field));
            super.parseText(text);
        }
    }
    get symbolType() {
        return new UnknownType();
    }
}