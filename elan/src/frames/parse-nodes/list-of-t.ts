import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { CSV } from "./csv";
import { ParseNode } from "./parse-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class ListOfT extends AbstractSequence {
    elementConstructor: () => ParseNode;

    constructor(elementConstructor: () => ParseNode, field : Field) {
        super(field);
        this.elementConstructor = elementConstructor;
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Symbol(`{`, this.field));
            this.elements.push(new CSV(this.elementConstructor,0, this.field));
            this.elements.push(new Symbol(`}`, this.field));
            super.parseText(text);
        }
    }
    
    get symbolType() {
        return new UnknownType();
    }
}