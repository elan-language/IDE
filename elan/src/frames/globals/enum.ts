import { Global } from "./global";
import { EnumValues } from "../text-fields/enum-values";
import { Type } from "../text-fields/type";
import { AbstractFrame } from "../abstract-frame";
import { Frame } from "../frame";
import { singleIndent } from "../helpers";

export class Enum extends AbstractFrame implements Global {
    name: Type;
    values: EnumValues;

    constructor(parent: Frame) {
        super(parent);
        this.htmlId = `enum${this.nextId()}`;
        this.multiline = true;
        this.name = new Type(this);
        this.name.setPrompt("Name");
        this.values = new EnumValues(this);
    }

    isGlobal = true;

    public override initialize(frameMap: Map<string, Frame>, parent?: Frame | undefined): void {
        super.initialize(frameMap, parent);
        this.name.initialize(frameMap, this);
        this.values.initialize(frameMap, this);
    }

    public override selectFirstText(): boolean {
        this.name.select(true);
        return true;
    }

    renderAsHtml(): string {
        return `<enum class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>enum </keyword>${this.name.renderAsHtml()}</top>
<statement>${this.values.renderAsHtml()}</statement>       
<keyword>end enum</keyword>
</enum>`;
    }

    indent(): string {
        return "";
    }

    renderAsSource(): string {
        return `enum ${this.name.renderAsSource()}\r
${singleIndent()}${this.values.renderAsSource()}\r
end enum\r
`;
    }
} 
