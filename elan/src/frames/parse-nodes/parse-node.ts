import { ParseStatus } from "../parse-status";

export interface ParseNode {
    status: ParseStatus;
    matchedText: string;
    remainingText: string;


    parseText(text: string): void;

    renderAsHtml(): string;
    renderAsSource(): string;
    renderAsObjectCode(): string;

    getCompletionAsHtml(): string;
    
    isValid(): boolean;
    isIncomplete(): boolean;
    isEmpty(): boolean;
    isInvalid(): boolean;
}