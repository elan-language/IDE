
import { UnknownType } from "../../symbols/UnknownType";
import { AbstractSequence } from "./abstract-sequence";
import { ParseNode } from "./parse-node";

export class Sequence extends AbstractSequence {

    elementConstructors: (() =>ParseNode)[];
    constructor(elementConstructors: (() =>ParseNode)[]) {
        super();
        this.elementConstructors = elementConstructors;
    }

    parseText(text: string): void { 
        if (text.trimStart().length > 0) {
            this.elementConstructors.forEach(ec => {
                this.elements.push(ec());
            });
        }
        super.parseText(text);
    }

    get symbolType() {
        return new UnknownType();
    }
}