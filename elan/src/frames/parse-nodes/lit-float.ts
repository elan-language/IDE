import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { LitInt } from "./lit-int";
import { RegExMatchNode } from "./regex-match-node";
import { UnknownType } from "../../symbols/UnknownType";

export class LitFloat extends AbstractSequence {

    constructor() {
        super();
        this.placeholder = "float value";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            this.elements.push(new LitInt());
            this.elements.push(new Symbol("."));
            this.elements.push(new RegExMatchNode(/^\s*[0-9]+/));
            super.parseText(text);
        } 
    }

    get symbolType() {
        return new UnknownType();
    }
}