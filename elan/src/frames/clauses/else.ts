
import { AbstractFrame } from "../abstract-frame";
import { Frame } from "../frame";
import { Statement } from "../statements/statement";
import { Expression } from "../text-fields/expression";

export class Else extends AbstractFrame implements Statement {
    hasIf: boolean = false;
    condition: Expression = new Expression("condition");

    constructor() {
        super();
        this.htmlId = `else${this.nextId()}`;
    }

    public override initialize(frameMap: Map<string, Frame>, parent?: Frame | undefined): void {
        super.initialize(frameMap, parent);
        this.condition.initialize(frameMap, this);
    }

    private ifClauseAsHtml() : string {
        return this.hasIf ? `<keyword> if </keyword>${this.condition.renderAsHtml()}<keyword> then</keyword>`:"";
    }

    private ifClauseAsSource() : string {
        return this.hasIf ? ` if ${this.condition.renderAsSource()} then`:``;
    }

    isStatement = true;

    renderAsHtml(): string {
        return `<clause class="${this.cls()}" id='${this.htmlId}' tabindex="0"><keyword>else</keyword>${this.ifClauseAsHtml()}</clause>`;
    }

    indent(): string {
        return this.getParent()?.indent()+""; //No additonal indent for an else clause
    }

    renderAsSource(): string {
        return `${this.indent()}else${this.ifClauseAsSource()}`;
    }

} 
