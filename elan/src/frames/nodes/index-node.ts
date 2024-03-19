
import { Expression } from "../fields/expression";
import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { ExprNode } from "./expr-node";
import { Punctuation } from "./punctuation";
import { Sequence } from "./sequence";

export class IndexNode extends AbstractSequence {

    constructor() {
        super();
        this.placeholder = "name";
    }

    parseText(text: string): void {
        this.remainingText = text;
        var expr = () => new ExprNode();
        var symbol = () => new Punctuation("..");
        var rangeFrom = () => new Sequence([expr, symbol]);
        var rangeBetween = () => new Sequence([expr, symbol,expr]);
        var rangeTo = () => new Sequence([symbol,expr]);
        var range = () => new Alternatives([rangeFrom, rangeBetween, rangeTo]);
        if (text.trimStart().length > 0) {
          this.elements.push(new Punctuation("["));
          this.elements.push(new Alternatives([expr, range]));
          this.elements.push(new Punctuation("]"));
          super.parseText(text);
        }
    }

    renderAsHtml(): string {
        throw new Error("Method not implemented.");
    }
}