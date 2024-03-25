import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { FunctionCallNode } from "./function-call-node";
import { IdentifierNode } from "./identifier-node";
import { IndexNode } from "./index-node";
import { Multiple } from "./multiple";

export class IndexableTerm extends AbstractSequence {
    constructor(field : Field) {
        super(field);
    }

    parseText(text: string): void {
        var indexableTerm = () =>  new Alternatives([() => new IdentifierNode(this.field), () => new FunctionCallNode(this.field)], this.field);
        this.elements.push(indexableTerm());
        var index = () => new IndexNode(this.field);
        this.elements.push(new Multiple(index, 0, this.field)); 
        super.parseText(text);
    }

    get symbolType() {
        return new UnknownType();
    }
}