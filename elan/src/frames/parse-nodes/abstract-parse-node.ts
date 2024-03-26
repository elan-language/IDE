import { Field } from "../interfaces/field";
import { ParseStatus } from "../parse-status";
import { ParseNode } from "./parse-node";

export abstract class AbstractParseNode implements ParseNode {

    constructor(protected field: Field) {

    }


    status: ParseStatus = ParseStatus.empty;
    matchedText: string = "";
    placeholder: string = "";
    remainingText: string = "";

    renderAsSource(): string {
        return this.matchedText.trim();
    }

    renderAsHtml(): string {
        return this.renderAsSource();
    }

    abstract parseText(text: string): void;

    renderAsObjectCode(): string { return "To be implemented"; } //TODO make abstract

    protected set(status: ParseStatus, matched: string, remaining: string) {
        this.status = status;
        this.matchedText = matched;
        this.remainingText = remaining;
    }

    protected numLeadingSpaces(text: string): number {
        return text.length - text.trimStart().length;
    }

    protected updateFrom(other: ParseNode) {
        this.status = other.status;
        this.matchedText = other.matchedText;
        this.remainingText = other.remainingText;
    }
}