import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { asKeyword } from "../keywords";
import { AbstractSequence } from "./abstract-sequence";
import { IdentifierNode } from "./identifier-node";
import { KeywordNode } from "./keyword-node";
import { TypeNode } from "./type-node";

export class ParamDefNode extends AbstractSequence {

    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        if (text.trim().length > 0) {
            this.elements.push(new IdentifierNode(this.field));
            this.elements.push(new KeywordNode(asKeyword, this.field));
            this.elements.push(new TypeNode(this.field));
            super.parseText(text);
        }
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}