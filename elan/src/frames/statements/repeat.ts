import { Statement } from "../interfaces/statement";
import { Expression } from "../fields/expression";
import { FrameWithStatements } from "../frame-with-statements";
import {ParentFrame} from "../interfaces/parent-frame";
import { Field } from "../interfaces/field";

export class Repeat extends FrameWithStatements implements Statement, ParentFrame {
    isStatement = true;
    condition: Expression;

    constructor(parent: ParentFrame) {
        super(parent);
        this.multiline = true;
        this.condition = new Expression(this);
        this.condition.setPrompt("condition");
    }

    getFields(): Field[] {
        return [this.condition];
    }

    getParentFrame(): ParentFrame {
        return this.getParent() as ParentFrame;
    }

    getPrefix(): string {
        return 'repeat';
    }

    public override selectFirstText(): boolean {
        this.condition.select();
        return true;
    }
    
    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>repeat</keyword></top>
${this.renderStatementsAsHtml()}
<keyword>end repeat when </keyword>${this.condition.renderAsHtml()}
</statement>`;
    }

    renderAsSource(): string {
        return `${this.indent()}repeat\r
${this.renderStatementsAsSource()}\r
${this.indent()}until ${this.condition.renderAsSource()}`;
    }
} 
