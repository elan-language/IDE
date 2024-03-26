import { ExpressionField } from "../fields/expression-field";
import { Parent } from "../interfaces/parent";
import { Field } from "../interfaces/field";
import {CodeSource } from "../code-source";
import { Value } from "../fields/value";
import { AbstractFrame } from "../abstract-frame";
import { Statement } from "../interfaces/statement";
import { ParseStatus } from "../parse-status";
import { findSymbolInFrameScope, findSymbolInScope } from "../../symbols/symbolHelpers";
import { compatibleType } from "../../symbols/rules";

export class SetStatement extends AbstractFrame implements Statement{
    isStatement = true;
    name: Value;
    expr: ExpressionField;

    constructor(parent: Parent) {
        super(parent);
        this.name = new Value(this);
        this.name.setPlaceholder("variableName");
        this.expr = new ExpressionField(this);
    }

    parseFrom(source: CodeSource): void {
        source.removeIndent();
        source.remove("set ");
        this.name.parseFrom(source);
        source.remove(" to ");
        this.expr.parseFrom(source);
        source.removeNewLine();
    }
    getFields(): Field[] {
        return [this.name, this.expr];
    }  
    getIdPrefix(): string {
        return 'set';
    }
    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0"><keyword>set </keyword>${this.name.renderAsHtml()}<keyword> to </keyword>${this.expr.renderAsHtml()}</statement>`;
    }
    renderAsSource(): string {
        return `${this.indent()}set ${this.name.renderAsSource()} to ${this.expr.renderAsSource()}`;
    }
    renderAsObjectCode(): string {
        return `${this.indent()}${this.name.renderAsObjectCode()} = ${this.expr.renderAsObjectCode()};`;
    }

    override frameStatus() : ParseStatus {
        const idSymbol = findSymbolInFrameScope(this.name.renderAsSource(), this);
        const expType = this.expr.symbolType;

        return compatibleType(idSymbol, expType);
    }
} 
