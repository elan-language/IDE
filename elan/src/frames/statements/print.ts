import { Expression } from "../fields/expression";
import { Parent} from "../interfaces/parent";
import { AbstractFrame} from "../abstract-frame";

import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";
import { SingleLineStatement } from "./single-line-statement";

export class Print extends SingleLineStatement  {
    expr: Expression;

    constructor(parent: Parent) {
        super(parent);
        this.expr = new Expression(this);
        this.expr.setOptional(true);
        this.expr.setPlaceholder("expression");
    }
    parseFrom(source: CodeSource): void {
        source.removeIndent();
        source.remove("print ");
        this.expr.parseFrom(source);
        source.removeNewLine();
    }
    getFields(): Field[] {
        return [this.expr];
    }
    getIdPrefix(): string {
        return 'print';
    }

    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0"><keyword>print </keyword>${this.expr.renderAsHtml()}</statement>`;
    }

    renderAsSource(): string {
        return `${this.indent()}print ${this.expr.renderAsSource()}`;
    }

    renderAsObjectCode(): string {
        return `${this.indent()}system.print(${this.expr.renderAsSource()});`;
    }
} 
