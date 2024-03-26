import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { AbstractSequence } from "./abstract-sequence";
import { Comma } from "./comma";
import { Multiple } from "./multiple";
import { Optional } from "./optional";
import { ParseNode } from "./parse-node";
import { Sequence } from "./sequence";


//A list of comma-separated values of a specified type, but with no list delimiters
export class CSV extends AbstractSequence {
    elementConstructor:  () => ParseNode;
    minimum: number;

    constructor(elementConstructor: () => ParseNode, minimum: number, field : Field) {
        super(field);
        this.elementConstructor = elementConstructor;
        this.minimum = minimum;
    }

    parseText(text: string): void {
        this.remainingText = text;
        var commaNodesMin = 0;
        var commaNode = () => new Sequence([() => new Comma(this.field), this.elementConstructor], this.field);

        if (this.minimum === 0) {
            this.elements.push(new Optional(this.elementConstructor, this.field));
        } else {
            this.elements.push(this.elementConstructor());
            commaNodesMin = this.minimum -1;
        }
        this.elements.push(new Multiple(commaNode, commaNodesMin, this.field));
        super.parseText(text);
    }
    
    get symbolType() {
        return UnknownType.Instance;
    }
    
}