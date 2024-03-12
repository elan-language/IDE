import { AbstractSequence } from "./abstract-sequence";
import { UnaryOp } from "./unary-op";
import { Term } from "./term";

export class UnaryTerm extends AbstractSequence {
    
    constructor() {
        super();
        this.placeholder = "op";
    }

    parseText(text: string): void {
        if (text.length > 0) {
            this.subNodes.push(new UnaryOp());
            this.subNodes.push(new Term());
            return super.parseText(text);
        }
    }
    renderAsHtml(): string {
        throw new Error("Method not implemented.");
    }
    renderAsSource(): string {
        throw new Error("Method not implemented.");
    }

}