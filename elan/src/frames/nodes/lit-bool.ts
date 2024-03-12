import { Alternatives } from "./abstract-alternatives";
import { FixedText } from "./fixed-text";

export class LitBool extends Alternatives {

    constructor() {
        super();
        this.placeholder = "true or false";
    }

    parseText(text: string): void {
        if (text.length > 0) {
            this.alternatives.push(new FixedText("true"));
            this.alternatives.push(new FixedText("false"));
            super.parseText(text);
        }
    }

    renderAsHtml(): string {
        throw new Error("Method not implemented.");
    }
    renderAsSource(): string {
        throw new Error("Method not implemented.");
    }
}

export class True extends FixedText {

}

export class False extends FixedText {
    
}