import { AbstractSequence } from "./abstract-sequence";
import { Symbol } from "./symbol";
import { CSV } from "./csv";
import { ParseNode } from "./parse-node";
import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import { ListType } from "../../symbols/ListType";
import { IHasSymbolType } from "../../symbols/IHasSymbolType";
import { isHasSymbolType } from "../../symbols/symbolHelpers";

export class List extends AbstractSequence implements IHasSymbolType  {
    elementConstructor: () => ParseNode;

    constructor(elementConstructor: () => ParseNode, field : Field) {
        super(field);
        this.elementConstructor = elementConstructor;
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elements.push(new Symbol(`[`, this.field));
            this.elements.push(new CSV(this.elementConstructor, 0, this.field));
            this.elements.push(new Symbol(`]`, this.field));
            super.parseText(text);
        }
    }
    
    get symbolType() {
       
        if (isHasSymbolType(this.elements[1])) {
            const ofType = this.elements[1].symbolType;
            return new ListType(ofType || UnknownType.Instance);
        }

        return new ListType(UnknownType.Instance);
    }
}