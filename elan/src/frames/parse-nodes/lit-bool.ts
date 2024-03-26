import { AbstractAlternatives } from "./abstract-alternatives";
import { Field } from "../interfaces/field";
import { BooleanType } from "../../symbols/BooleanType";
import { KeywordNode } from "./keyword-node";
import { IHasSymbolType } from "../../symbols/IHasSymbolType";

export class LitBool extends AbstractAlternatives {

    constructor(field : Field) {
        super(field);
        this.placeholder = "true or false";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            this.alternatives.push(new KeywordNode("true", this.field));
            this.alternatives.push(new KeywordNode("false", this.field));
            super.parseText(text);
        }
    }

    get symbolType() {
        return BooleanType.Instance;
    }
    
}