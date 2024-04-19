import { ParseStatus } from "../parse-status";
import { AbstractParseNode } from "./abstract-parse-node";
import { CSV_Element } from "./csv-element";
import { ParseNode } from "./parse-node";

export class CSV extends AbstractParseNode {
    elementConstructor: () => ParseNode;
    minimum: number;
    private elements: CSV_Element[] = [];

    constructor(elementConstructor: () => ParseNode, minimum: number) {
        super();
        this.elementConstructor = elementConstructor;
        this.minimum = minimum;
        for (let i = 1; i <= minimum; i++) {
            this.elements.push(new CSV_Element(elementConstructor(), i < minimum)); 
        }
    }

    getElements(): ParseNode[] {
        return this.elements;
    }

    parseText(text: string) {
        this.remainingText = text;
        this.parseMinimumNodes(); 
        if (this.status === ParseStatus.valid && this.remainingText.length > 0) {
            this.parseAdditionalNodes(); 
        }     
    }

    parseMinimumNodes() {
        this.status = ParseStatus.valid;
        var i = 0;
        while (i < this.elements.length && this.status > ParseStatus.incomplete) {
            var node = this.elements[i];
            node.parseText(this.remainingText);
            if (node.status === ParseStatus.empty) {
                this.status = ParseStatus.incomplete;
            } else if (node.status < this.status){
                this.status = node.status;
            }   
            this.matchedText += node.matchedText;
            this.remainingText = node.remainingText;
            i++;
        }
    }

    parseAdditionalNodes() {
        var cont = true;
        while(this.status === ParseStatus.valid && this.remainingText.length > 0 && cont){
            var nodes = this.elements;
            var last = nodes[nodes.length - 1];
            if (!last || last.hasComma()) {
                var newNode = new CSV_Element(this.elementConstructor(), false);
                newNode.parseText(this.remainingText);
                if (newNode.status > ParseStatus.empty) {
                    this.elements.push(newNode);
                    this.status = newNode.status;
                    this.matchedText += newNode.matchedText;
                    this.remainingText = newNode.remainingText;
                } else  {
                    cont = false;
                }
            } else {
                cont = false;
            }
        }      
    }

    renderAsHtml(): string {
        return this.elements.reduce((result, current) => result + current.renderAsHtml(), "");
    }
    renderAsSource(): string {
        return this.elements.reduce((result, current) => result + current.renderAsSource(), "");
    }

    getCompletionAsHtml(): string {
        var comp = "";
        var next = new CSV_Element(this.elementConstructor(), false).getCompletionAsHtml();
        if (this.elements.length === 0) {
            comp = `<opt>${next}</opt>`;
        } else if (this.endsWithComma()) {
            comp = `${next}`;
        }else {
           comp = this.elements.reduce((result, current) => `${result}${current.getCompletionAsHtml()}`, "");
        }
        return comp;
    }

    private endsWithComma(): boolean {
        var last = this.elements[this.elements.length - 1];
        return last.hasComma();
    }
}