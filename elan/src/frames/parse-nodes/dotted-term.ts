import { AbstractSequence } from "./abstract-sequence";
import { IndexableTerm } from "./indexed-term";
import { Multiple } from "./multiple";
import { Symbol } from "./symbol";
import { Sequence } from "./sequence";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class DottedTerm extends AbstractSequence {
    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        if (text.trim().length > 0) {
            var dottableTerm = () =>  new IndexableTerm(this.field);
            var dottedAddition = () => new Sequence([() => new Symbol(".", this.field), dottableTerm], this.field);
            this.elements.push(dottableTerm());
            this.elements.push(new Multiple(dottedAddition,0, this.field)); 
            super.parseText(text);
        }
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}