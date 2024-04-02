import { AbstractAlternatives } from "./abstract-alternatives";
import { Field } from "../interfaces/field";
import { BooleanType } from "../../symbols/boolean-type";
import { KeywordNode } from "./keyword-node";
import { IHasSymbolType } from "../../symbols/has-symbol-type";
import { falseKeyword, trueKeyword } from "../keywords";

export class LitBool extends AbstractAlternatives {

    constructor() {
        super();
        this.placeholder = "true or false";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            this.alternatives.push(new KeywordNode(trueKeyword));
            this.alternatives.push(new KeywordNode(falseKeyword));
            super.parseText(text);
        }
    }

    get symbolType() {
        return BooleanType.Instance;
    }
    
}