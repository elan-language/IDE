import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { Keyword } from "./keyword";
import { ExprNode } from "./expr-node";
import { UnknownType } from "../../symbols/UnknownType";

export class IfExpr extends AbstractSequence {
    constructor() {
        super();
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Keyword("if"));
            this.elements.push(new ExprNode());
            this.elements.push(new Keyword("then"));
            this.elements.push(new ExprNode());
            this.elements.push(new Keyword("else"));
            this.elements.push(new ExprNode()); 
            super.parseText(text);
        }
    }
    
    get symbolType() {
        return new UnknownType();
    }
}