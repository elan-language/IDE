import { AbstractSequence } from "./abstract-sequence";
import { CSV } from "./csv";
import { KeywordNode } from "./keyword-node";
import { ExprNode } from "./expr-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { lambdaKeyword, returnKeyword } from "../keywords";
import { ParamDefNode } from "./param-def-node";

export class Lambda extends AbstractSequence {
    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new KeywordNode(lambdaKeyword, this.field));
            this.elements.push(new CSV(() => new ParamDefNode(this.field), 1, this.field));
            this.elements.push(new KeywordNode(returnKeyword, this.field));
            this.elements.push(new ExprNode(this.field));
            super.parseText(text);
        }
    }

    renderAsSource(): string {
        return `${lambdaKeyword} ${this.elements[1].renderAsSource()} ${returnKeyword} ${this.elements[3].renderAsSource()}`;
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}