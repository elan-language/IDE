import { OPEN_BRACKET, CLOSE_BRACKET } from "../symbols";
import { AbstractSequence } from "./abstract-sequence";
import { CSV } from "./csv";
import { SymbolNode } from "./symbol-node";
import { TypeNode } from "./type-node";

export class TypeTuple extends AbstractSequence {
    types: CSV | undefined;
   
    parseText(text: string): void {
        if (text.length > 0) {
            this.types = new CSV(() => new TypeNode(), 2);
            this.addElement(new SymbolNode(OPEN_BRACKET));
            this.addElement(this.types);
            this.addElement(new SymbolNode(CLOSE_BRACKET));
            super.parseText(text);
        }
    }

    getCompletionAsHtml(): string {
        return "";
    }
}