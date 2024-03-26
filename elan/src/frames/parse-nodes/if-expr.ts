import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { Keyword } from "./keyword";
import { ExprNode } from "./expr-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class IfExpr extends AbstractSequence {
    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Keyword("if", this.field));
            this.elements.push(new ExprNode(this.field));
            this.elements.push(new Keyword("then", this.field));
            this.elements.push(new ExprNode(this.field));
            this.elements.push(new Keyword("else", this.field));
            this.elements.push(new ExprNode(this.field)); 
            super.parseText(text);
        }
    }
    
    get symbolType() {
        return UnknownType.Instance;
    }
}