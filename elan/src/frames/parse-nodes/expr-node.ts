import { Field } from "../interfaces/field";
import { AbstractAlternatives } from "./abstract-alternatives";
import { BinaryExpression } from "./binary-expression";
import { ListOfExpr } from "./listOfExpr";
import { Term } from "./term";
import { TupleDefNode } from "./tuple-def-node";

export class ExprNode extends AbstractAlternatives {
    constructor(field : Field) {
        super(field);
        this.placeholder = "expression";
    }

    parseText(text: string): void {
        this.alternatives.push(new Term(this.field));
        this.alternatives.push(new BinaryExpression(this.field));
        super.parseText(text);
    }
    
}