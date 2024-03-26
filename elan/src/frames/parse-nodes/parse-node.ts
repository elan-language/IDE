import { ISymbolType } from "../../symbols/ISymbolType";
import { ParseStatus } from "../parse-status";

export interface ParseNode {
    status: ParseStatus;
    matchedText: string;
    remainingText: string;

    parseText(text: string): void;

    symbolType? : ISymbolType;

    renderAsHtml(): string;
    renderAsSource(): string;
    renderAsObjectCode(): string;
}