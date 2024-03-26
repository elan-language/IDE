import { UnknownType } from "../../symbols/UnknownType";
import { findSymbolInScope } from "../../symbols/symbolHelpers";
import { Field } from "../interfaces/field";
import { AbstractParseNode } from "./abstract-parse-node";
import { matchRegEx } from "./parse-node-helpers";

export class IdentifierNode extends AbstractParseNode {

    constructor(field : Field) {
        super(field);
        this.placeholder = "name";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            [this.status, this.matchedText, this.remainingText] = matchRegEx(text, /^\s*[a-z]\w*/);
        }
    }

    get symbolType() {
        return findSymbolInScope(this.matchedText, this.field)?.symbolType;
    }
}