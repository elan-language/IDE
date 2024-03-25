
import { ExpressionField } from "../fields/expression-field";
import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { ExprNode } from "./expr-node";
import { Symbol } from "./symbol";
import { Sequence } from "./sequence";
import { UnknownType } from "../../symbols/UnknownType";

export class IndexNode extends AbstractSequence {

    constructor() {
        super();
        this.placeholder = "name";
    }

    parseText(text: string): void {
        this.remainingText = text;
        var expr = () => new ExprNode();
        var symbol = () => new Symbol("..");
        var rangeFrom = () => new Sequence([expr, symbol]);
        var rangeBetween = () => new Sequence([expr, symbol,expr]);
        var rangeTo = () => new Sequence([symbol,expr]);
        var range = () => new Alternatives([rangeFrom, rangeBetween, rangeTo]);
        if (text.trimStart().length > 0) {
          this.elements.push(new Symbol("["));
          this.elements.push(new Alternatives([expr, range]));
          this.elements.push(new Symbol("]"));
          super.parseText(text);
        }
    }
    
    get symbolType() {
        return new UnknownType();
    }
    
}