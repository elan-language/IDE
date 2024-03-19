import { AbstractAlternatives } from "./abstract-alternatives";
import { Punctuation } from "./punctuation";
import { Keyword } from "./keyword";
import { singleLeadingSpace } from "./node-helpers";

export class LitBool extends AbstractAlternatives {

    constructor() {
        super();
        this.placeholder = "true or false";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            this.alternatives.push(new Keyword("true"));
            this.alternatives.push(new Keyword("false"));
            super.parseText(text);
        }
    }

    renderAsHtml(): string {
        throw new Error("Method not implemented.");
    }
}

export class True extends Punctuation {

}

export class False extends Punctuation {
    
}