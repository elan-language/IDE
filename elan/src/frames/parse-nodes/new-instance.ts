import { UnknownType } from "../../symbols/UnknownType";
import { AbstractSequence } from "./abstract-sequence";
import { CSV } from "./csv";
import { ExprNode } from "./expr-node";
import { Keyword } from "./keyword";
import { Symbol } from "./symbol";
import { TypeWithOptGenerics } from "./type-with-opt-generics";


export class NewInstance extends AbstractSequence {
    constructor() {
        super();
    }

    parseText(text: string): void {
        this.elements.push(new Keyword("new"));
        this.elements.push(new TypeWithOptGenerics());
        this.elements.push(new Symbol("(")); 
        this.elements.push(new CSV(() => new ExprNode(),0)); 
        this.elements.push(new Symbol(")")); 
        super.parseText(text);
    }

    get symbolType() {
        return new UnknownType();
    }
}