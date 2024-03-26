import { AbstractParseNode } from "./abstract-parse-node";
import { ParseNode } from "./parse-node";
import { ParseStatus } from "../parse-status";
import { Field } from "../interfaces/field";
import { IHasSymbolType } from "../../symbols/IHasSymbolType";
import { isHasSymbolType } from "../../symbols/symbolHelpers";
import { UnknownType } from "../../symbols/UnknownType";

export abstract class AbstractAlternatives extends AbstractParseNode implements IHasSymbolType {
    alternatives: ParseNode[] = [];
    bestMatch?: ParseNode;

    constructor(field : Field) {
        super(field);
        this.placeholder = "expression";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.trimStart().length > 0) {
            var cont = true;
            var i = 0;
            while (i < this.alternatives.length && cont) {
                var alt = this.alternatives[i];
                alt.parseText(text);
                if (alt.status === ParseStatus.valid && alt.remainingText.length === 0) {
                    this.bestMatch = alt;
                    cont = false;
                } else if (!this.bestMatch
                    || alt.remainingText.length < this.bestMatch.remainingText.length
                    || alt.remainingText.length === this.bestMatch.remainingText.length && alt.status > this.bestMatch.status) {
                    this.bestMatch = alt;
                }
                i++;
            };
            if (this.bestMatch!.status > ParseStatus.invalid) {
                this.status = this.bestMatch!.status;
                this.matchedText = this.bestMatch!.matchedText;
                this.remainingText = this.bestMatch!.remainingText;
            } else {
                this.bestMatch = undefined;
                this.status = ParseStatus.invalid;
            }
        }
    }

    renderAsHtml(): string {
        return this.bestMatch ? this.bestMatch.renderAsHtml() : "";
    }
    renderAsSource(): string {
        return this.bestMatch ? this.bestMatch.renderAsSource() : "";
    }

    get symbolType() {
        if (isHasSymbolType(this.bestMatch)) {
            return this.bestMatch.symbolType;
        }

        return UnknownType.Instance;
    }
}