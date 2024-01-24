import { Global } from "./global";
import { Identifier } from "../text-fields/identifier";
import { ParamList } from "../text-fields/param-list";
import { Member, Role } from "../class-members/member";
import { FrameWithStatements } from "../frame-with-statements";
import { Frame } from "../frame";
import { FileFrame } from "../file-frame";

export class Procedure extends FrameWithStatements implements Global, Member {

    public htmlId : string ="";
    public name : Identifier = new Identifier("name");
    public params: ParamList = new ParamList();

    constructor() {
        super();
        this.htmlId = `proc${this.nextId()}`;
        this.multiline = true;
    }

    public override initialize(frameMap: Map<string, Frame>, parent?: Frame | undefined): void {
        super.initialize(frameMap, parent);
        this.name.initialize(frameMap, this);
        this.params.initialize(frameMap, this);
    }

    isGlobal = true;
    isMember = true;

    public override selectFirstText(): boolean {
        this.name.select();
        return true;
    }

    currentRole(): Role {
        return this.getParent() instanceof FileFrame ? Role.global : Role.member;
    }

    public renderAsHtml() : string {
        return `<procedure class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>procedure </keyword>${this.name.renderAsHtml()}(${this.params.renderAsHtml()})</top>
${this.renderStatementsAsHtml()}
<keyword>end procedure</keyword>
</procedure>`;
    }

    indent(): string {
        return "";
    }

    public renderAsSource() : string {
        return `procedure ${this.name.renderAsSource()}(${this.params.renderAsSource()})\r
${this.renderStatementsAsSource()}\r
end procedure\r
`;
    }
}