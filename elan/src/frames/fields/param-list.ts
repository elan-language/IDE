import { CodeSource } from "../code-source";
import { Frame } from "../interfaces/frame";
import { CSV } from "../parse-nodes/csv";
import { ParamDefNode } from "../parse-nodes/param-def-node";
import { ParseNode } from "../parse-nodes/parse-node";
import { AbstractField } from "./abstract-field";

export class ParamList extends AbstractField {
    constructor(holder: Frame) {
        super(holder);
        this.setPlaceholder("parameter definitions");
        this.useHtmlTags = true;
        this.setOptional(true);
    }

    getIdPrefix(): string {
        return 'params';
    }
    public contentAsSource() : string {
        if (this.text) {
         return this.text;
        } else {
            return "";
        }
    }    
    initialiseRoot(): ParseNode | undefined { 
        this.rootNode = new CSV(() => new ParamDefNode(this), 0, this);
        return this.rootNode; 
    }
    readToDelimeter: ((source: CodeSource) => string) | undefined =
        (source: CodeSource) => source.readToNonMatchingCloseBracket();
}