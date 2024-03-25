import { ExprNode } from "./expr-node";
import { BinaryOperation } from "./binary-operation";
import { AbstractSequence } from "./abstract-sequence";
import { IdentifierNode } from "./identifier-node";
import { Term } from "./term";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";

export class BinaryExpression extends AbstractSequence {
    get symbolType() {
        return new UnknownType();
    }
    
    constructor(field : Field) {
        super(field);
        this.placeholder = "expression";
    }

    parseText(text: string): void {
        this.elements.push(new Term(this.field));
        this.elements.push(new BinaryOperation(this.field));
        this.elements.push(new ExprNode(this.field));
        return super.parseText(text);
    }
    
}