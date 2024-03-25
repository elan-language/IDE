import { UnknownType } from "../../symbols/UnknownType";
import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { FunctionCallNode } from "./function-call-node";
import { IdentifierNode } from "./identifier-node";
import { IndexNode } from "./index-node";
import { Multiple } from "./multiple";

export class IndexableTerm extends AbstractSequence {
    constructor() {
        super();
    }

    parseText(text: string): void {
        var indexableTerm = () =>  new Alternatives([() => new IdentifierNode, () => new FunctionCallNode()]);
        this.elements.push(indexableTerm());
        var index = () => new IndexNode();
        this.elements.push(new Multiple(index, 0)); 
        super.parseText(text);
    }

    get symbolType() {
        return new UnknownType();
    }
}