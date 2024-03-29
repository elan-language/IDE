import { IHasSymbolTypes } from "../../symbols/has-symbol-types";
import { mapSymbolTypes } from "../../symbols/symbolHelpers";
import { Field } from "../interfaces/field";
import { ParseStatus } from "../parse-status";
import { AbstractParseNode } from "./abstract-parse-node";
import { ParseNode } from "./parse-node";

export class Multiple extends AbstractParseNode implements IHasSymbolTypes {
    elementConstructor: () => ParseNode;
    minimum: number;
    elements: ParseNode[] = [];

    constructor(elementConstructor: () => ParseNode, minimum: number, field : Field) {
        super(field);
        this.elementConstructor = elementConstructor;
        this.minimum = minimum;
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.length === 0) {
            this.status = this.minimum === 0 ? ParseStatus.valid : ParseStatus.empty;
        } else {
            var toParse = text;
            var cont = true;
            while (cont && toParse.trimStart().length > 0) {
                var node = this.elementConstructor();
                node.parseText(toParse);
                if (node.status === ParseStatus.valid) {
                    this.elements.push(node);
                    toParse = node.remainingText;
                } else if (node.status === ParseStatus.incomplete && node.remainingText === "") {
                    this.elements.push(node);
                    toParse = "";
                } else {
                    cont = false;
                }
            }
            if (this.elements.length === 0 && this.minimum === 0) {
                this.status = ParseStatus.valid;
                this.remainingText = toParse;
            } else if (this.elements.length >= this.minimum) {
                var last = this.elements[this.elements.length - 1];
                this.status = last.status;
                var matchedLength = text.length - toParse.length;
                this.matchedText = text.substring(0, matchedLength);
                this.remainingText = toParse;
            } else {
                this.status = ParseStatus.invalid;
                this.remainingText = text;
            }
        };
    }

    renderAsHtml(): string {
        return this.elements.reduce((result, current) => result + current.renderAsHtml(), "");
    }
    renderAsSource(): string {
        return this.elements.reduce((result, current) => result + current.renderAsSource(),"");
     }

     get symbolTypes() {
        return mapSymbolTypes(this.elements);
    }
}