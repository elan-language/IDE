
import { Identifier } from "../fields/identifier";
import { ParamList } from "../fields/param-list";
import { Type } from "../fields/type";
import { ReturnStatement } from "../statements/return-statement";
import { FrameWithStatements } from "../frame-with-statements";
import { Parent} from "../interfaces/parent";
import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";
import { File } from "../interfaces/file";
import { Profile } from "../interfaces/profile";
import { endKeyword, functionKeyword, returnKeyword } from "../keywords";

export class Function extends FrameWithStatements implements Parent {
    isGlobal = true;
    public name : Identifier;
    public params: ParamList;
    public returnType: Type;
    file: File;

    constructor(parent: Parent) {
        super(parent);
        this.file = parent as File;
        this.name = new Identifier(this);
        this.params = new ParamList(this);
        this.returnType = new Type(this);
        this.returnType.setPlaceholder("return type");
        this.getChildren().push(new ReturnStatement(this));
    }
    getProfile(): Profile {
        return this.getParent().getProfile();
    }

    minimumNumberOfChildrenExceeded(): boolean {
        return this.getChildren().length > 1; // return may be the only statement
    }

    getFields(): Field[] {
        return [this.name, this.params, this.returnType];
    }

    getIdPrefix(): string {
        return 'func';
    }
    public renderAsHtml() : string {
        return `<function class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>${functionKeyword} </keyword>${this.name.renderAsHtml()}(${this.params.renderAsHtml()})<keyword> ${ returnKeyword} </keyword>${this.returnType.renderAsHtml()}</top>
${this.renderChildrenAsHtml()}
<keyword>${endKeyword} ${functionKeyword}</keyword>
</function>`;
    }

    indent(): string {
        return "";
    }

    public renderAsSource() : string {
        return `${functionKeyword} ${this.name.renderAsSource()}(${this.params.renderAsSource()}) ${ returnKeyword} ${this.returnType.renderAsSource()}\r
${this.renderChildrenAsSource()}\r
${endKeyword} ${functionKeyword}\r
`;
    }

    parseTop(source: CodeSource): void {
        source.remove(`${functionKeyword} `);
        this.name.parseFrom(source);
        source.remove("(");
        this.params.parseFrom(source);
        source.remove(`) ${ returnKeyword} `);
        this.returnType.parseFrom(source);
    }
    parseBottom(source: CodeSource): boolean {
        var result = false;
        var keyword = `${returnKeyword} `;
        source.removeIndent();
        if (source.isMatch(keyword)) {
            this.getReturnStatement().parseFrom(source);
            source.removeNewLine().removeIndent();
            this.parseStandardEnding(source, `${endKeyword} ${functionKeyword}`);
            result = true;
        }
        return result;
    }
    private getReturnStatement() : ReturnStatement {
        return this.getChildren().filter(s => ('isReturnStatement' in s))[0] as ReturnStatement;
    }
}