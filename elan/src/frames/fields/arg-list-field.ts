import { AbstractField } from "./abstract-field";
import { Frame } from "../interfaces/frame";
import { ParseStatus } from "../parse-status";
import { CodeSource } from "../code-source";
import { ParseNode } from "../parse-nodes/parse-node";
import { ExprNode } from "../parse-nodes/expr-node";
import { CSV } from "../parse-nodes/csv";

export class ArgListField extends AbstractField {
    constructor(holder: Frame) {
        super(holder);
        this.setPlaceholder("arguments");
        this.setOptional(true);
    }
    getIdPrefix(): string {
        return 'args';
    }
    public contentAsSource() : string {
        if (this.text) {
         return this.text;
        } else {
            return "";
        }
    }
    initialiseRoot(): ParseNode | undefined { 
        this.rootNode = new CSV(() => new ExprNode(this),0, this);
        return this.rootNode; 
    }
    readToDelimeter: ((source: CodeSource) => string) | undefined = 
      (source: CodeSource) => source.readToNonMatchingCloseBracket();
}