import { andKeyword, divKeyword, isKeyword, modKeyword, notKeyword, orKeyword, xorKeyword } from "../keywords";
import { AbstractAlternatives } from "./abstract-alternatives";
import { Keyword } from "./keyword";
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
        this.alternatives.push(new Keyword(isKeyword, this.field));
        var is = () => new Keyword(isKeyword, this.field);
        var not = () => new Keyword(notKeyword, this.field);
        this.alternatives.push(new Sequence([is,not], this.field));
        this.alternatives.push(new Keyword(andKeyword, this.field));
        this.alternatives.push(new Keyword(orKeyword, this.field));
        this.alternatives.push(new Keyword(xorKeyword, this.field));
        this.alternatives.push(new Keyword(modKeyword, this.field));
        this.alternatives.push(new Keyword(divKeyword, this.field));;
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