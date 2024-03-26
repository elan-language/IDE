
import { IHasSymbolType } from "../../symbols/IHasSymbolType";
import { IHasSymbolTypes } from "../../symbols/IHasSymbolTypes";
import { UnknownType } from "../../symbols/UnknownType";
import { isHasSymbolType } from "../../symbols/symbolHelpers";
import { Field } from "../interfaces/field";
import { AbstractSequence } from "./abstract-sequence";
import { ParseNode } from "./parse-node";

export class Sequence extends AbstractSequence implements IHasSymbolTypes {

    elementConstructors: (() => ParseNode)[];
    constructor(elementConstructors: (() => ParseNode)[], field : Field) {
        super(field);
        this.elementConstructors = elementConstructors;
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            this.elementConstructors.forEach(ec => {
                this.elements.push(ec());
            });
        }
        super.parseText(text);
    }

    get symbolTypes() {
        return this.elements.filter(e => isHasSymbolType(e)).map(e => (e as IHasSymbolType).symbolType);
    }
}