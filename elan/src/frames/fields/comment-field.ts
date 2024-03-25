import { CodeSource } from "../code-source";
import { Frame } from "../interfaces/frame";
import { ParseNode } from "../parse-nodes/parse-node";
import { RegExMatchNode } from "../parse-nodes/regex-match-node";
import { ParseStatus } from "../parse-status";
import { AbstractField } from "./abstract-field";
import { anythingToNewline } from "./parse-functions";

export class CommentField extends AbstractField {
    constructor(holder: Frame) {
        super(holder);
        this.setOptional(true);
        this.setPlaceholder("comment");
    }
    getIdPrefix(): string {
        return 'comment';
    }
    initialiseRoot(): ParseNode | undefined { 
       this.rootNode =  new RegExMatchNode(/.*/, this);
       return this.rootNode;
    }
    readToDelimeter: ((source: CodeSource) => string) | undefined = (source: CodeSource) => source.readToEndOfLine();
}