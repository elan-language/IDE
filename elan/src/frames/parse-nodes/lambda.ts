import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { CSV } from "./csv";
import { Keyword } from "./keyword";
import { IdentifierNode } from "./identifier-node";
import { ExprNode } from "./expr-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class Lambda extends AbstractSequence {
    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Keyword(`lambda`, this.field));
            this.elements.push(new CSV(() => new IdentifierNode(this.field),1, this.field));
            this.elements.push(new Symbol(`->`, this.field));
            this.elements.push(new ExprNode(this.field));
            super.parseText(text);
        }
    }

    renderAsSource(): string {
        return `lambda ${this.elements[1].renderAsSource()} -> ${this.elements[3].renderAsSource()}`;
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}