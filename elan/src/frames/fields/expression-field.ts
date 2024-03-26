import { UnknownType } from "../../symbols/UnknownType";
import { isHasSymbolType } from "../../symbols/symbolHelpers";
import { CodeSource } from "../code-source";
import { Frame } from "../interfaces/frame";
import { ExprNode } from "../parse-nodes/expr-node";
import { ParseNode } from "../parse-nodes/parse-node";
import { ParseStatus } from "../parse-status";
import { AbstractField } from "./abstract-field";
import { anythingToNewline } from "./parse-functions";

export class ExpressionField extends AbstractField  {

    constructor(holder: Frame) {
        super(holder);
        this.setPlaceholder("value or expression");
    }
    getIdPrefix(): string {
        return 'expr';
    }
    initialiseRoot(): ParseNode | undefined {
        this.rootNode = new ExprNode(this);
        return this.rootNode;
    }
    readToDelimeter: ((source: CodeSource) => string) | undefined = (source: CodeSource) => source.readToEndOfLine();
    public textAsHtml(): string {
        if (this.selected) {
            return super.textAsHtml();
        }
        else{ 
            return this.rootNode ? this.rootNode.renderAsHtml() : super.textAsHtml();
        } 
    }

    get symbolType() {
        if (isHasSymbolType(this.rootNode)) {
            return this.rootNode.symbolType;
        }

        return UnknownType.Instance;
    }
}
