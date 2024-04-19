import { AbstractSequence } from "./abstract-sequence";
import { KeywordNode } from "./keyword-node";
import { OptionalNode } from "./optional-node";
import { SymbolNode } from "./symbol-node";
import { Sequence } from "./sequence";
import { TypeNode } from "./type-node";
import { TypeSimpleNode } from "./type-simple-node";
import { GT, LT } from "../symbols";
import { ofKeyword } from "../keywords";
import { SpaceNode } from "./space-node";
import { Space } from "./parse-node-helpers";
import { CommaNode } from "./comma-node";
import { Multiple } from "./multiple";

export class TypeWithOptGenerics extends AbstractSequence {
    simpleType: TypeSimpleNode | undefined;
    generic: OptionalNode | undefined;

    constructor() {
        super();
        this.completionWhenEmpty = "Type";
    }
    parseText(text: string): void {
        this.remainingText = text;
        if (text.length > 0) {
           this.simpleType = new TypeSimpleNode();
            var lt = () => new SymbolNode(LT);
            var of = () => new KeywordNode(ofKeyword);
            var sp = () => new SpaceNode(Space.required);
            var type = () => new TypeNode();
            var commaType = () => new Sequence([() => new CommaNode() ,() => new TypeNode()]);
            var commaTypes = () => new Multiple(commaType, 0);  //TODO - this should be a CSV
            var gt =() => new SymbolNode(GT);
            var genericNode = new Sequence([lt,of,sp,type,commaTypes,gt]);
            this.generic = new OptionalNode(genericNode);
            this.addElement(this.simpleType);
            this.addElement(this.generic);
            super.parseText(text);
        }
    }

    getCompletionAsHtml(): string {
        return "";
    }
}