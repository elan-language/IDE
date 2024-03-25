import { AbstractAlternatives } from "./abstract-alternatives";
import { Symbol } from "./symbol";
import { Keyword } from "./keyword";
import { Field } from "../interfaces/field";

export class LitBool extends AbstractAlternatives {

    constructor(field : Field) {
        super(field);
        this.placeholder = "true or false";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            this.alternatives.push(new Keyword("true", this.field));
            this.alternatives.push(new Keyword("false", this.field));
            super.parseText(text);
        }
    }

    
}

export class True extends Symbol {

}

export class False extends Symbol {
    
}