import { andKeyword, divKeyword, isKeyword, modKeyword, notKeyword, orKeyword, xorKeyword } from "../keywords";
import { AbstractAlternatives } from "./abstract-alternatives";
import { KeywordNode } from "./keyword-node";
import { Symbol } from "./symbol";
import { Sequence } from "./sequence";

export class BinaryOperation extends AbstractAlternatives {
    parseText(text: string): void {  
        this.alternatives.push(new Symbol("+",this.field));
        this.alternatives.push(new Symbol("-",this.field));
        this.alternatives.push(new Symbol("*",this.field));
        this.alternatives.push(new Symbol("/",this.field));
        this.alternatives.push(new Symbol(">", this.field));
        this.alternatives.push(new Symbol("<", this.field));
        this.alternatives.push(new Symbol(">=", this.field));
        this.alternatives.push(new Symbol("<=", this.field));
        this.alternatives.push(new KeywordNode(isKeyword, this.field));
        var is = () => new KeywordNode(isKeyword, this.field);
        var not = () => new KeywordNode(notKeyword, this.field);
        this.alternatives.push(new Sequence([is,not], this.field));
        this.alternatives.push(new KeywordNode(andKeyword, this.field));
        this.alternatives.push(new KeywordNode(orKeyword, this.field));
        this.alternatives.push(new KeywordNode(xorKeyword, this.field));
        this.alternatives.push(new KeywordNode(modKeyword, this.field));
        this.alternatives.push(new KeywordNode(divKeyword, this.field));;
        super.parseText(text);
    }

    renderAsSource(): string {
        return ` ${this.bestMatch?.renderAsSource()}${this.trailingSpace()}`;
    }

    renderAsHtml(): string {
        return ` ${this.bestMatch?.renderAsHtml()}${this.trailingSpace()}`;
    }

    private trailingSpace(): string {
        return ("isSymbol" in this.bestMatch!) ? " " : "";
    }
}