
import { AbstractFrame } from "../abstract-frame";
import { Field } from "../interfaces/field";
import { Parent } from "../interfaces/parent";
import { StatementSelectorField } from "../fields/statement-selector-field";

export class StatementSelector extends AbstractFrame  {
    isGlobal = true;
    selector: StatementSelectorField;

    constructor(parent: Parent) {
        super(parent);
        this.selector  = new StatementSelectorField(this);
    }

    getFields(): Field[] {
        return [this.selector];
    }

    getPrefix(): string {
        return 'const';
    }

    public override selectFirstText(): boolean {
        this.selector.select();
        return true;
    }

    renderAsHtml(): string {
        return `<statement>${this.selector.renderAsHtml()}</statement>`;
    }

    renderAsSource(): string {
        return `${this.indent()}`;
    }
} 
