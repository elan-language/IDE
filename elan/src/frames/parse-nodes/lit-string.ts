import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { RegExMatchNode } from "./regex-match-node";
import { UnknownType } from "../../symbols/UnknownType";

export class LitString extends AbstractSequence {
    constructor() {
        super();
        this.placeholder = `"string"`;
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Symbol(`"`));
            this.elements.push(new RegExMatchNode(/^[^"]*/));
            this.elements.push(new Symbol(`"`));
            super.parseText(text);
        }
    }
    renderAsHtml(): string {
        return `<string>${this.renderAsSource()}</string>`;
    }

    get symbolType() {
        return new UnknownType();
    }
}