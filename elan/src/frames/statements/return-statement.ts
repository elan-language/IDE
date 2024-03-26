import { ExpressionField } from "../fields/expression-field";
import { Parent } from "../interfaces/parent";
import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";
import { Statement } from "../interfaces/statement";
import { AbstractFrame } from "../abstract-frame";
import { resultKeyword } from "../keywords";

export class ReturnStatement extends AbstractFrame implements Statement{
    isStatement = true; 
    isReturnStatement = true;  
    expr: ExpressionField;

    constructor(parent: Parent) {
        super(parent);
        this.movable = false;
        this.expr = new ExpressionField(this);
        this.expr.setText(resultKeyword);
    }

    deleteIfPermissible(): void {}; //Does nothing as return cannot be deleted

    getFields(): Field[] {
        return [this.expr];
    }

    getIdPrefix(): string {
        return 'return';
    }
    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0"><keyword>return </keyword>${this.expr.renderAsHtml()}</statement>`;
    }

    renderAsSource(): string {
        return `${this.indent()}return ${this.expr.renderAsSource()}`;
    }

    renderAsObjectCode(): string {
        return `${this.indent()}return ${this.expr.renderAsObjectCode()};`;
    }

    parseFrom(source: CodeSource): void {
        source.removeIndent();
        source.remove("return ");
        this.expr.parseFrom(source);
    }

    canInsertAfter(): boolean {
        return false;
    }
} 
