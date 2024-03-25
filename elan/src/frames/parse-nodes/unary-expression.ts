import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { Term } from "./term";
import { Symbol } from "./symbol";
import { Keyword } from "./keyword";
import { notKeyword } from "../keywords";
import { UnknownType } from "../../symbols/UnknownType";

export class UnaryExpression extends AbstractSequence {
    
    constructor() {
        super();
        this.placeholder = "op";
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            var unaryOp = new Alternatives([() => new Symbol("-"), () => new Keyword(notKeyword) ]);
            this.elements.push(unaryOp);
            this.elements.push(new Term());
            return super.parseText(text);
        }
    }

    get symbolType() {
        return new UnknownType();
    }
    
}