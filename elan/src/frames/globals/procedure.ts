import { ISymbol, SymbolScope } from "../../symbols/symbol";
import { UnknownType } from "../../symbols/unknown-type";
import { CodeSource } from "../code-source";
import { IdentifierField } from "../fields/identifier-field";
import { ParamList } from "../fields/param-list";
import { FrameWithStatements } from "../frame-with-statements";
import { Field } from "../interfaces/field";
import { File } from "../interfaces/file";
import { Frame } from "../interfaces/frame";
import { Parent } from "../interfaces/parent";

export class Procedure extends FrameWithStatements {
    isGlobal = true;
    public name : IdentifierField;
    public params: ParamList;
    file: File;

    constructor(parent: Parent) {
        super(parent);
        this.file = parent as File;
        this.name = new IdentifierField(this);
        this.params = new ParamList(this);
    }

    getFields(): Field[] {
        return [this.name, this.params];
    }

    getIdPrefix(): string {
        return 'proc';
    }
    public renderAsHtml() : string {
        return `<procedure class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>procedure </keyword><method>${this.name.renderAsHtml()}</method>(${this.params.renderAsHtml()})</top>
${this.renderChildrenAsHtml()}
<keyword>end procedure</keyword>
</procedure>`;
    }
    indent(): string {
        return "";
    }
    public renderAsSource() : string {
        return `procedure ${this.name.renderAsSource()}(${this.params.renderAsSource()})\r
${this.renderChildrenAsSource()}\r
end procedure\r
`;
    }
    public renderAsObjectCode() : string {
        return `function ${this.name.renderAsObjectCode()}(${this.params.renderAsObjectCode()}) {\r
${this.renderStatementsAsObjectCode()}\r
}\r
`;
    }
    parseTop(source: CodeSource): void {
        source.remove("procedure ");
        this.name.parseFrom(source);
        source.remove("(");
        this.params.parseFrom(source);
        source.remove(")");
    }
    parseBottom(source: CodeSource): boolean {
       return this.parseStandardEnding(source, "end procedure");
    }

    resolveSymbol(id: string, initialScope : Frame): ISymbol {
        if (this.name.renderAsObjectCode() === id){
            return {
                symbolId : id,
                symbolType : undefined,
                symbolScope : SymbolScope.program
            } as ISymbol;
        }

        return this.params.resolveSymbol(id, initialScope) ?? super.resolveSymbol(id, initialScope);
    }
}