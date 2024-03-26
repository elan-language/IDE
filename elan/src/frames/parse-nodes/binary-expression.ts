import { ExprNode } from "./expr-node";
import { BinaryOperation } from "./binary-operation";
import { AbstractSequence } from "./abstract-sequence";
import { Term } from "./term";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { FloatType } from "../../symbols/FloatType";
import { IHasSymbolType } from "../../symbols/IHasSymbolType";

export class BinaryExpression extends AbstractSequence implements IHasSymbolType {
    
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
        const nodes = this.elements as [Term, BinaryOperation, ExprNode];
        const opType = nodes[1].symbolType;
        if (opType && opType !== UnknownType.Instance) {
            return opType;
        }

        const lhsType =  nodes[0].symbolType;
        const rhsType =  nodes[2].symbolType;

        // both int or both float
        if (lhsType?.name === rhsType?.name) {
            return lhsType;
        }
        // either was float so float
        return FloatType.Instance;
    }

}