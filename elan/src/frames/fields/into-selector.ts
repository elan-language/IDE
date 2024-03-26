import { AbstractField } from "./abstract-field";
import { editorEvent } from "../interfaces/editor-event";
import { Else } from "../statements/else";
import { CodeSource } from "../code-source";
import { ParseStatus } from "../parse-status";
import { ParseNode } from "../parse-nodes/parse-node";
import { ExternalStatement } from "../statements/external-statement";

export class IntoSelector extends AbstractField {
    private ext: ExternalStatement;

    constructor(holder: ExternalStatement) {
        super(holder);
        this.ext = holder;
        this.setPlaceholder("into");
        this.setOptional(true);
    }
    getIdPrefix(): string {
        return 'into';
    }

    indent(): string {
        return "";
    }

    renderAsSource(): string {
        return ``;
    } 

    processKey(keyEvent: editorEvent): void {
        var char = keyEvent.key;
        var empty = this.text ==="";
        if (empty && (char ==='i')) {
            this.ext.setIntoExtension(true);
            this.getHolder().select(true, false);
            return;
        }
        super.processKey(keyEvent);
    }
    parseFrom(source: CodeSource): void {
        throw new Error("Not implemented.");
    }
    parseFunction(input: [ParseStatus, string]): [ParseStatus, string] {
        throw new Error("Not implemented.");
    }  
    initialiseRoot(): ParseNode | undefined { return undefined; }
    readToDelimeter: ((source: CodeSource) => string) | undefined = undefined;
}
