import { ExprNode } from "./expr-node";
import { BinaryOperation } from "./binary-operation";
import { AbstractSequence } from "./abstract-sequence";
import { IdentifierNode } from "./identifier-node";
import { Term } from "./term";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { FloatType } from "../../symbols/FloatType";

export class BinaryExpression extends AbstractSequence {
    
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
    
    get symbolType() {
        const opType = this.elements[1].symbolType;
        if (opType && opType !== UnknownType.Instance) {
            return opType;
        }

        const lhsType =  this.elements[0].symbolType;
        const rhsType =  this.elements[2].symbolType;

        // both int or both float
        if (lhsType?.name === rhsType?.name) {
            return lhsType;
        }
        // either was float so float
        return FloatType.Instance;
    }

}