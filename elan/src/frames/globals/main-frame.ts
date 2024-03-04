import { AbstractSelector } from "../abstract-selector";
import { CodeSource } from "../code-source";
import { FrameWithStatements } from "../frame-with-statements";
import { Field } from "../interfaces/field";
import { Parent } from "../interfaces/parent";
import { GlobalSelector } from "./global-selector";
import { File } from "../interfaces/file";

export class MainFrame extends FrameWithStatements {
    isMain = true;
    isGlobal = true;
    file: File;
    
    constructor(parent: File) {
        super(parent);
        this.file = parent;
        this.multiline = true;
    }

    getFields(): Field[] {
        return []; //no direct fields
    }

    getIdPrefix(): string {
        return 'main';
    }

    public renderAsHtml() : string {
        return `<main class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>main</keyword></top>
${this.renderStatementsAsHtml()}
<keyword>end main</keyword>
</main>`;
    }

    indent(): string {
        return "";
    }

    public renderAsSource() : string {
        return `main\r
${this.renderStatementsAsSource()}\r
end main\r
`;
    }

    public renderAsObjectCode() : string {
        return `export async function main(system) {\r
${this.renderStatementsAsObjectCode()}\r
}\r
`;
    }

    parseTopOfFrame(source: CodeSource) {
        source.remove("main");
    }  
    parseBottomOfFrame(source: CodeSource): boolean {
       return this.parseStandardEnding(source, "end main");
    }
    insertSelector(after: boolean): void {
        this.file.insertGlobalSelector(after, this);
    }
}