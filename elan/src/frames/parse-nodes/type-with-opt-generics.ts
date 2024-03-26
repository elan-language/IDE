
import { AbstractSequence } from "./abstract-sequence";
import { KeywordNode } from "./keyword-node";
import { Optional } from "./optional";
import { Symbol } from "./symbol";
import { Sequence } from "./sequence";
import { TypeNode } from "./type-node";
import { TypeSimpleNode } from "./type-simple-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class TypeWithOptGenerics extends AbstractSequence {

    constructor(field : Field) {
        super(field);
    }
    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            var simpleType = () => new TypeSimpleNode(this.field);
            var genericNode = () => new Sequence([() => new Symbol("<", this.field), () => new KeywordNode("of", this.field), () => new TypeNode(this.field),() => new Symbol(">", this.field)], this.field);
            var optGeneric = () => new Optional(genericNode, this.field);
            this.elements.push(simpleType());
            this.elements.push(optGeneric());
            super.parseText(text);
        }
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}