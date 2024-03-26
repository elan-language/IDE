import { IntType } from "../../symbols/IntType";
import { Field } from "../interfaces/field";
import { AbstractParseNode } from "./abstract-parse-node";
import { matchRegEx } from "./parse-node-helpers";

export class LitInt extends AbstractParseNode {


    constructor(field: Field) {
        super(field);
        this.placeholder = "integer value";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            [this.status, this.matchedText, this.remainingText] = matchRegEx(text, /^\s*[0-9]+/);
        }
    }
    get symbolType() {
        return IntType.Instance;
    }

}