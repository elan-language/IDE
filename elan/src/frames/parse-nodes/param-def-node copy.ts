import { UnknownType } from "../../symbols/UnknownType";
import { outKeyword } from "../keywords";
import { AbstractSequence } from "./abstract-sequence";
import { IdentifierNode } from "./identifier-node";
import { Keyword } from "./keyword";
import { Optional } from "./optional";
import { TypeNode } from "./type-node";

export class ParamDefNode extends AbstractSequence {

    parseText(text: string): void {
        if (text.trim().length > 0) {
            this.elements.push(new Optional(() => new Keyword(outKeyword)));
            this.elements.push(new IdentifierNode());
            this.elements.push(new TypeNode());
            super.parseText(text);
        }
    }

    get symbolType() {
        return new UnknownType();
    }
}