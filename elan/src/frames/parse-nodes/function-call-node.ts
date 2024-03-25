import { AbstractSequence } from "./abstract-sequence";
import { CSV } from "./csv";
import { ExprNode } from "./expr-node";
import { Symbol } from "./symbol";
import { IdentifierNode } from "./identifier-node";
import { UnknownType } from "../../symbols/UnknownType";

export class FunctionCallNode extends AbstractSequence {
    constructor() {
        super();
    }
    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            this.elements.push(new IdentifierNode());
            this.elements.push(new Symbol("("));
            this.elements.push(new CSV(() => new ExprNode(),0)); //arg list
            this.elements.push(new Symbol(")"));
            super.parseText(text);
        }
    }
    renderAsHtml(): string {
        return `<method>${this.elements[0].renderAsHtml()}</method>(${this.elements[2].renderAsHtml()})`;
    }
    
    get symbolType() {
        return new UnknownType();
    }
}