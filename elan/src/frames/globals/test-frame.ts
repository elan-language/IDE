import { CodeSource } from "../code-source";
import { IdentifierField } from "../fields/identifier-field";
import { FrameWithStatements } from "../frame-with-statements";
import { Field } from "../interfaces/field";
import { File } from "../interfaces/file";
import { AssertStatement } from "../statements/assert-statement";

export class TestFrame extends FrameWithStatements {
    isTest = true;
    isGlobal = true;
    public testName : IdentifierField;
    file: File;

    constructor(parent: File) {
        super(parent);
        this.file = parent;
        this.testName = new IdentifierField(this);
        var selector = this.getChildren().pop()!;
        this.getChildren().push(new AssertStatement(this));
        this.getChildren().push(selector);
    }

    getFields(): Field[] {
        return [this.testName];
    }

    getIdPrefix(): string {
        return 'test';
    }
    public renderAsHtml() : string {
        return `<test class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>test </keyword>${this.testName.renderAsHtml()}</top>
${this.renderChildrenAsHtml()}
<keyword>end test</keyword>
</test>`;
    }
    indent(): string {
        return "";
    }
    public renderAsSource() : string {
        return `test ${this.testName.renderAsSource()}\r
${this.renderChildrenAsSource()}\r
end test\r
`;
    }
    parseTop(source: CodeSource): void {
        source.remove("test ");
        this.testName.parseFrom(source);
    }
    parseBottom(source: CodeSource): boolean {
       return this.parseStandardEnding(source, "end test");
    }
}