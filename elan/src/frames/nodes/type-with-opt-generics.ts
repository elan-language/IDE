
import { AbstractSequence } from "./abstract-sequence";
import { Keyword } from "./keyword";
import { Optional } from "./optional";
import { Punctuation } from "./punctuation";
import { RegExMatchNode } from "./regex-match-node";
import { Sequence } from "./sequence";
import { TypeNode } from "./type-node";

export class TypeWithOptGenerics extends AbstractSequence {

    constructor() {
        super();
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            var simpleType = () => new RegExMatchNode(/^\s*[A-Z]\w*/);
            var genericNode = () => new Sequence([() => new Punctuation("<"), () => new Keyword("of"), () => new TypeNode(),() => new Punctuation(">")]);
            var optGeneric = () => new Optional(genericNode);
            this.elements.push(simpleType());
            this.elements.push(optGeneric());
            super.parseText(text);
        }
    }

    renderAsHtml(): string {
        throw new Error("Method not implemented.");
    }
}