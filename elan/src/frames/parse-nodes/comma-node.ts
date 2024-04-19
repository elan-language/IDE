import { COMMA } from "../symbols";
import { AbstractSequence } from "./abstract-sequence";
import { Space } from "./parse-node-helpers";
import { SpaceNode } from "./space-node";
import { SymbolNode } from "./symbol-node";

export class CommaNode extends AbstractSequence {

    parseText(text: string): void {
        var ignoreSpace =  new SpaceNode(Space.ignored);
        var comma =  new SymbolNode(COMMA);
        var addSpace = new SpaceNode(Space.added);
        this.addElement(ignoreSpace);
        this.addElement(comma);
        this.addElement(addSpace);
        super.parseText(text);
    }
    getCompletionAsHtml(): string {
        return ", ".substring(this.renderAsSource().length);
    }
}
