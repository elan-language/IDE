import { FrameWithStatements } from "../frame-with-statements";
import { ParamList } from "../fields/param-list";
import { Member } from "../interfaces/member";
import { Class } from "../globals/class";
import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";

export class Constructor extends FrameWithStatements implements Member {
    isConstructor = true;
    isMember = true;
    public params: ParamList ;

    constructor(parent: Class) {
        super(parent);
        this.multiline = true;
        this.params = new ParamList(parent);
    }

    getFields(): Field[] {
        return [this.params];
    }

    getIdPrefix(): string {
        return 'constructor';
    }

    public override selectFirstField(): boolean {
        this.params.select();
        return true;
    }


    public renderAsHtml(): string {
        return `<constructor class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>constructor</keyword>(${this.params.renderAsHtml()})</top>
${this.renderStatementsAsHtml()}
<keyword>end constructor</keyword>
</constructor>`;
    }
    public renderAsSource(): string {
        return `${this.indent()}constructor(${this.params.renderAsSource()})\r
${this.renderStatementsAsSource()}\r
${this.indent()}end constructor\r
`;
    }
    parseTopOfFrame(source: CodeSource): void {
        source.removeIndent();
        source.remove("constructor(");
        this.params.parseFrom(source);
        source.remove(")");
    }
    parseBottomOfFrame(source: CodeSource): boolean {
        source.removeIndent();
        return this.parseStandardEnding(source, "end constructor");
    }
}