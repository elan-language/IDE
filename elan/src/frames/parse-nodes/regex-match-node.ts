import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { AbstractParseNode } from "./abstract-parse-node";
import { matchRegEx } from "./parse-node-helpers";

export class RegExMatchNode extends AbstractParseNode {
    regx: RegExp;

    constructor(regx: RegExp, field : Field) {
        super(field);
        this.regx = regx;
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            [this.status, this.matchedText, this.remainingText] = matchRegEx(text, this.regx);
        }
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}