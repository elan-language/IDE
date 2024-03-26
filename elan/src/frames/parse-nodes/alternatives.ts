import { ParseNode } from "./parse-node";
import { AbstractAlternatives } from "./abstract-alternatives";
import { Field } from "../interfaces/field";

export class Alternatives extends AbstractAlternatives {

    elementConstructors: (() =>ParseNode)[];
    constructor(elementConstructors: (() =>ParseNode)[], field : Field) {
        super(field);
        this.elementConstructors = elementConstructors;
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elementConstructors.forEach(ec => {
                this.alternatives.push(ec());
            });
        }
        super.parseText(text);
    }
}