
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { AbstractSequence } from "./abstract-sequence";
import { ParseNode } from "./parse-node";

export class Sequence extends AbstractSequence {

    elementConstructors: (() => ParseNode)[];
    constructor(elementConstructors: (() => ParseNode)[], field : Field) {
        super(field);
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
        for (const e of this.elements) {
            const st = e.symbolType;
            if (st && st !== UnknownType.Instance) {
                return st;
            }
        }

        return UnknownType.Instance;
    }
}