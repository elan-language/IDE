import { ParseStatus } from "../parse-status";
import { AbstractSequence } from "./abstract-sequence";
import { CommaNode } from "./comma-node";
import { OptionalNode } from "./optional-node";
import { ParseNode } from "./parse-node";

export class CSV_Element extends AbstractSequence {

    contents: ParseNode;
    comma: ParseNode;
    private mandatoryComma: boolean;

    constructor(node: ParseNode, mandatoryComma: boolean) {
        super();
        this.contents = node;
        this.addElement(node);
        this.mandatoryComma = mandatoryComma;
        if (mandatoryComma) {
            this.comma = new CommaNode();
        } else {
            this.comma = new OptionalNode(new CommaNode());
        }
        this.addElement(this.comma);
    }

    hasComma() : boolean {
        return this.comma instanceof CommaNode ? this.comma.status === ParseStatus.valid : (this.comma as OptionalNode).optionTaken();
    }
    getCompletionAsHtml(): string {
        var value = this.contents.getCompletionAsHtml();
        var comma = "";
        if (!this.hasComma()) {
            //Problem here - when don't you want to show optional comma
            if (this.contents.isValid()) {
                comma = this.comma.getCompletionAsHtml();
            } else if (this.mandatoryComma) {
                comma = ", ";
            }
        }
        return `${value}${comma}`;
    }
}