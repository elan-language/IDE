import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { ExprNode } from "./expr-node";
import { Symbol } from "./symbol";
import { Sequence } from "./sequence";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class IndexNode extends AbstractSequence {

    constructor(field : Field) {
        super(field);
        this.placeholder = "name";
    }

    parseText(text: string): void {
        this.remainingText = text;
        var expr = () => new ExprNode(this.field);
        var symbol = () => new Symbol("..", this.field);
        var rangeFrom = () => new Sequence([expr, symbol], this.field);
        var rangeBetween = () => new Sequence([expr, symbol,expr], this.field);
        var rangeTo = () => new Sequence([symbol,expr], this.field);
        var range = () => new Alternatives([rangeFrom, rangeBetween, rangeTo], this.field);
        if (text.trimStart().length > 0) {
          this.elements.push(new Symbol("[", this.field));
          this.elements.push(new Alternatives([expr, range], this.field));
          this.elements.push(new Symbol("]", this.field));
          super.parseText(text);
        }
    }
    
    get symbolType() {
        return UnknownType.Instance;
    }
    
}