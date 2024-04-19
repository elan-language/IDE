import { ParseStatus } from "../parse-status";
import { ParseNode } from "./parse-node";

export abstract class AbstractParseNode implements ParseNode {

    status: ParseStatus = ParseStatus.empty;
    matchedText: string = "";
    completionWhenEmpty: string = "";
    remainingText: string = "";

    setCompletionWhenEmpty(ph: string) {
        this.completionWhenEmpty = ph;
    }

    getCompletionAsHtml(): string {
        return this.status === ParseStatus.empty ? `<pr>${this.completionWhenEmpty}</pr>` : "";
    }

    renderAsSource(): string {
        return this.matchedText.trim();
    }

    renderAsHtml(): string {
        return this.renderAsSource();
    }

    abstract parseText(text: string): void;

    renderAsObjectCode(): string { 
        return this.matchedText.trim(); 
    } //TODO make abstract

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

    isValid(): boolean {
        return this.status === ParseStatus.valid;
    }   
    isIncomplete(): boolean {
        return this.status === ParseStatus.incomplete;
    }
    isEmpty(): boolean {
        return this.status === ParseStatus.empty;
    }
    isInvalid(): boolean {
        return this.status === ParseStatus.invalid;
    }
}