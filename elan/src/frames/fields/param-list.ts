import { CodeSource } from "../code-source";
import { Frame } from "../interfaces/frame";
import { ParseNode } from "../parse-nodes/parse-node";
import { ParseStatus } from "../parse-status";
import { AbstractField } from "./abstract-field";
import { paramsList } from "./parse-functions";

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
    parseFunction(input: [ParseStatus, string]): [ParseStatus, string] {
        return paramsList(input);
    }   
    initialiseRoot(): ParseNode | undefined { return undefined; }
    readToDelimeter: ((source: CodeSource) => string) | undefined = undefined;
}