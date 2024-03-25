import { UnknownType } from "../../symbols/UnknownType";
import { AbstractParseNode } from "./abstract-parse-node";
import { matchRegEx } from "./parse-node-helpers";

export class LitChar extends AbstractParseNode {
    constructor() {
        super();
        this.placeholder = "char value";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            [this.status, this.matchedText, this.remainingText] = matchRegEx(text, /^\s*'.'/);
        }
    }

    get symbolType() {
        return new UnknownType();
    }
}