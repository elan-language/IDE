
import { ParseStatus } from "../parse-status";
import { AbstractParseNode } from "./abstract-parse-node";
import { ParseNode } from "./parse-node";

export class OptionalNode extends AbstractParseNode {
    option: ParseNode;
    matchedNode?: ParseNode;

    constructor(option: ParseNode) {
        super();
        this.option = option;
    }

    optionTaken(): boolean {
        return this.matchedNode !== undefined;
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.length > 0) {
            var option = this.option;
            option.parseText(text);
            if (option.status === ParseStatus.valid || (option.status === ParseStatus.incomplete && option.remainingText.trim() === "")) {
                this.updateFrom(option);
                this.matchedNode = option;
            } else {
                this.status = ParseStatus.valid;
                this.remainingText = text;
            }
        } else {
            this.status = ParseStatus.valid;
        }
    }
    renderAsHtml(): string {
        return this.matchedNode ? this.matchedNode.renderAsHtml() : "";
    }
    renderAsSource(): string {
        return this.matchedNode ? this.matchedNode.renderAsSource() : "";
    }

    getCompletionAsHtml(): string {
        var comp = ``;
        if (this.matchedNode){
            if (this.matchedNode.isValid()) {
                comp = "";
            } else {
              comp = this.matchedNode.getCompletionAsHtml();    
            }       
        } else {
            comp = `<opt>${this.option.getCompletionAsHtml()}</opt>`;
        }
        return comp;
    }
}