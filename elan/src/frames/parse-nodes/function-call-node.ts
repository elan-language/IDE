import { AbstractSequence } from "./abstract-sequence";
import { CSV } from "./csv";
import { ExprNode } from "./expr-node";
import { SymbolNode } from "./symbol-node";
import { IdentifierNode } from "./identifier-node";
import { globalKeyword, libraryKeyword } from "../keywords";
import { Alternatives } from "./alternatives";
import { KeywordNode } from "./keyword-node";
import { OptionalNode } from "./optional-node";
import { CLOSE_BRACKET, OPEN_BRACKET } from "../symbols";
import { QualifierDot } from "./qualifierDot";
import { InstanceNode } from "./instanceNode";

export class FunctionCallNode extends AbstractSequence {
    qualifier: OptionalNode | undefined;
    name : IdentifierNode |undefined;
    args : CSV | undefined;

    parseText(text: string): void {
        if (text.trim().length > 0) {
            var global = () => new KeywordNode(globalKeyword);
            var lib = () => new KeywordNode(libraryKeyword);
            var instance = () => new InstanceNode();;
            var qualifiers = new Alternatives([global, lib, instance]);
            var qualDot = () => new QualifierDot(qualifiers);
            this.qualifier =  new OptionalNode(qualDot);
            this.name = new IdentifierNode();
            this.args =new CSV(() => new ExprNode(),0);

            this.addElement(this.qualifier);
            this.addElement(this.name);
            this.addElement(new SymbolNode(OPEN_BRACKET));
            this.addElement(this.args); //arg list
            this.addElement(new SymbolNode(CLOSE_BRACKET));
            super.parseText(text);
        }
    }
    renderAsHtml(): string {
        return `${this.qualifier?.renderAsHtml()}<method>${this.name!.renderAsHtml()}</method>(${this.args!.renderAsHtml()})`;
    }

}