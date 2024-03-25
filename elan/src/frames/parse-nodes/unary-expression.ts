import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { Term } from "./term";
import { Symbol } from "./symbol";
import { Keyword } from "./keyword";
import { notKeyword } from "../keywords";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class UnaryExpression extends AbstractSequence {
    
    constructor(field : Field) {
        super(field);
        this.placeholder = "op";
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            var unaryOp = new Alternatives([() => new Symbol("-", this.field), () => new Keyword(notKeyword, this.field) ], this.field);
            this.elements.push(unaryOp);
            this.elements.push(new Term(this.field));
            return super.parseText(text);
        }
    }

    get symbolType() {
        return new UnknownType();
    }
    
}