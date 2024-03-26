import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { AbstractSequence } from "./abstract-sequence";
import { CSV } from "./csv";
import { ExprNode } from "./expr-node";
import { KeywordNode } from "./keyword-node";
import { Symbol } from "./symbol";
import { TypeWithOptGenerics } from "./type-with-opt-generics";

export class NewInstance extends AbstractSequence {
    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        this.elements.push(new KeywordNode("new", this.field));
        this.elements.push(new TypeWithOptGenerics(this.field));
        this.elements.push(new Symbol("(", this.field)); 
        this.elements.push(new CSV(() => new ExprNode(this.field),0, this.field)); 
        this.elements.push(new Symbol(")", this.field)); 
        super.parseText(text);
    }

    get symbolType() {
        return  UnknownType.Instance;
    }
}