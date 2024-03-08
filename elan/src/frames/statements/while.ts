import { Expression } from "../fields/expression";
import { Parent} from "../interfaces/parent";
import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";
import { MultiLineStatement } from "./multi-line-statement";

export class While extends MultiLineStatement { 
    isStatement = true;
    condition: Expression;

    constructor(parent: Parent) {
        super(parent);
        this.condition = new Expression(this);
        this.condition.setPlaceholder("condition");
    }

    getFields(): Field[] {
        return [this.condition];
    }

    getIdPrefix(): string {
        return 'while';
    }
    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>while </keyword>${this.condition.renderAsHtml()}</top>
${this.renderChildrenAsHtml()}
<keyword>end while</keyword>
</statement>`;
    }
    renderAsSource(): string {
        return `${this.indent()}while ${this.condition.renderAsSource()}\r
${this.renderChildrenAsSource()}\r
${this.indent()}end while`;
    }
    parseTop(source: CodeSource): void {
        source.remove("while ");
        this.condition.parseFrom(source);
    }
    parseBottom(source: CodeSource): boolean {
        return this.parseStandardEnding(source, "end while");
    }
} 
