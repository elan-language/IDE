import { AbstractFrame } from "../abstract-frame";
import { Frame } from "../frame";
import { Statement } from "../statements/statement";
import { Identifier } from "../text-fields/identifier";

export class Catch extends AbstractFrame implements Statement {
    variable: Identifier = new Identifier("variableName");

    constructor() {
        super();
        this.htmlId = `catch${this.nextId()}`;
        this.variable.enterText("e");
    }

    public override initialize(frameMap: Map<string, Frame>, parent?: Frame | undefined): void {
        super.initialize(frameMap, parent);
        this.variable.initialize(frameMap, this);
    }

    renderAsHtml(): string {
        return `<clause class="${this.cls()}" id='${this.htmlId}' tabindex="0"><keyword>catch </keyword>${this.variable.renderAsHtml()}</clause>`;
    }
} 