import { Field } from "../interfaces/field";
import { AbstractAlternatives } from "./abstract-alternatives";
import { LitBool } from "./lit-bool";
import { LitChar } from "./lit-char";
import { LitFloat } from "./lit-float";
import { LitInt } from "./lit-int";
import { LitString } from "./lit-string";

export class LiteralValue extends AbstractAlternatives {
    constructor(field : Field) {
        super(field);
        this.placeholder = "";
    }

    parseText(text: string): void {
        //Sub nodes added only when asked to parse
        this.alternatives.push(new LitInt(this.field));
        this.alternatives.push(new LitFloat(this.field));
        this.alternatives.push(new LitChar(this.field));
        this.alternatives.push(new LitBool(this.field));
        this.alternatives.push(new LitString(this.field));
        super.parseText(text);
    }
}