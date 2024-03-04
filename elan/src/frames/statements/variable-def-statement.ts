import { Expression } from "../fields/expression";
import { Parent} from "../interfaces/parent";
import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";
import { VariableDef } from "../fields/variable";
import { SingleLineStatement } from "./single-line-statement";

export class VariableDefStatement extends SingleLineStatement  {
    isStatement = true;
    name: VariableDef;
    expr: Expression;

    constructor(parent: Parent) {
        super(parent);
        this.name = new VariableDef(this);
        this.expr = new Expression(this);
    }
    parseFrom(source: CodeSource): void {
        source.removeIndent();
        source.remove("var ");
        this.name.parseFrom(source);
        source.remove(" set to ");
        this.expr.parseFrom(source);
        source.removeNewLine();
    }
    getFields(): Field[] {
        return [this.name, this.expr];
    } 
    getIdPrefix(): string {
        return 'var';
    }

   renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0"><keyword>var </keyword>${this.name.renderAsHtml()}<keyword> set to </keyword>${this.expr.renderAsHtml()}</statement>`;
    }

    renderAsSource(): string {
        return `${this.indent()}var ${this.name.renderAsSource()} set to ${this.expr.renderAsSource()}`;
    }

    renderAsObjectCode(): string {
        return `${this.indent()}var ${this.name.renderAsObjectCode()} = ${this.expr.renderAsObjectCode()};`;
    }
} 
