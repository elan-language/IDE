import { AbstractSequence } from "./abstract-sequence";
import { IdentifierNode } from "./identifier-node";
import { Symbol } from "./symbol";
import { RegExMatchNode } from "./regex-match-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class EnumVal extends AbstractSequence {
    constructor(field: Field) {
        super(field);
    }

    parseText(text: string): void {
        this.elements.push(new RegExMatchNode(/^\s*[A-Z]\w*/, this.field));
        this.elements.push(new Symbol(".", this.field));
        this.elements.push(new IdentifierNode(this.field));
        super.parseText(text);
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}