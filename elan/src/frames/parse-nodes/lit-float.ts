import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { LitInt } from "./lit-int";
import { RegExMatchNode } from "./regex-match-node";
import { Field } from "../interfaces/field";
import { FloatType } from "../../symbols/FloatType";
import { Optional } from "./optional";
import { Sequence } from "./sequence";

export class LitFloat extends AbstractSequence {

    constructor(field : Field) {
        super(field);
        this.placeholder = "float value";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            this.elements.push(new LitInt(this.field));
            this.elements.push(new Symbol(".", this.field));
            this.elements.push(new RegExMatchNode(/^\s*[0-9]+/, this.field));
            var exponent = new Optional(() => new Sequence([
                () => new Symbol('e', this.field),
                () => new RegExMatchNode(/^-?[0-9]+/, this.field)
                ], this.field), this.field);
            this.elements.push(exponent);
            super.parseText(text);
        }
    }

    get symbolType() {
        return FloatType.Instance;
    }
    renderAsObjectCode(): string { return this.matchedText.toUpperCase(); } //For the exponent e -> E
}