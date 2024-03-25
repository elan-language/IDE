import { AbstractSequence } from "./abstract-sequence";
import { IndexableTerm } from "./indexed-term";
import { Multiple } from "./multiple";
import { Symbol } from "./symbol";
import { Sequence } from "./sequence";
import { UnknownType } from "../../symbols/UnknownType";

export class DottedTerm extends AbstractSequence {
    constructor() {
        super();
    }

    parseText(text: string): void {
        if (text.trim().length > 0) {
            var dottableTerm = () =>  new IndexableTerm();
            var dottedAddition = () => new Sequence([() => new Symbol("."), dottableTerm]);
            this.elements.push(dottableTerm());
            this.elements.push(new Multiple(dottedAddition,0)); 
            super.parseText(text);
        }
    }

    get symbolType() {
        return new UnknownType();
    }
}