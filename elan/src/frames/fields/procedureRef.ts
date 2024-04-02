import { CodeSource } from "../code-source";
import { Frame } from "../interfaces/frame";

import { Alternatives } from "../parse-nodes/alternatives";
import { IdentifierNode } from "../parse-nodes/identifier-node";
import { ParseNode } from "../parse-nodes/parse-node";
import { Sequence } from "../parse-nodes/sequence";
import { SymbolNode } from "../parse-nodes/symbol-node";
import { DOT } from "../symbols";
import { AbstractField } from "./abstract-field";

export class ProcedureRef extends AbstractField {
    isParseByNodes = true;
    constructor(holder: Frame) {
        super(holder);
        this.setPlaceholder("procedure");
    }
    getIdPrefix(): string {
        return 'ident';
    }
    initialiseRoot(): ParseNode { 
        var instance = () => new IdentifierNode(this);
        var dot = () => new SymbolNode(DOT, this);        
        var proc = () => new IdentifierNode(this);
        var qualProc = () => new Sequence([instance, dot, proc], this);
        this.rootNode =  new Alternatives([proc, qualProc], this);  
        return this.rootNode; 
    }
    readToDelimeter: ((source: CodeSource) => string) = (source: CodeSource) => source.readUntil(/\(/);

    public textAsHtml(): string {
        if (this.selected) {
            return super.textAsHtml();
        } else { 
            return `<method>${this.text}</method>`;
        } 
    }
}