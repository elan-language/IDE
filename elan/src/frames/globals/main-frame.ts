import { AbstractSelector } from "../abstract-selector";
import { CodeSource } from "../code-source";
import { FrameWithStatements } from "../frame-with-statements";
import { Field } from "../interfaces/field";
import { Parent } from "../interfaces/parent";
import { GlobalSelector } from "./global-selector";
import { File } from "../interfaces/file";
import { Frame } from "../interfaces/frame";
import { ISymbol } from "../../symbols/symbol";

export class MainFrame extends FrameWithStatements {
    isMain = true;
    isGlobal = true;
    file: File;
    
    constructor(parent: File) {
        super(parent);
        this.file = parent;
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
${this.renderChildrenAsHtml()}
<keyword>end main</keyword>
</main>`;
    }

    indent(): string {
        return "";
    }

    public renderAsSource() : string {
        return `main\r
${this.renderChildrenAsSource()}\r
end main\r
`;
    }

    public renderAsObjectCode() : string {
        return `export async function main() {\r
${this.renderStatementsAsObjectCode()}\r
}\r
`;
    }
    parseTop(source: CodeSource) {
        source.remove("main");
    }  
    parseBottom(source: CodeSource): boolean {
       return this.parseStandardEnding(source, "end main");
    }
}