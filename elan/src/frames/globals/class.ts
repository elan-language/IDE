import { AbstractFrame } from "../abstract-frame";
import { Global } from "./global";
import { Type } from "../text-fields/type";
import { Constructor } from "../class-members/constructor";
import { Member } from "../class-members/member";
import { AsString } from "../class-members/as-string";
import { MemberSelector } from "../class-members/member-selector";
import { Frame } from "../frame";
import { HasChildren } from "../has-children";
import { isMember, safeSelectAfter, safeSelectBefore, selectChildRange } from "../helpers";


export class Class extends AbstractFrame implements Global, HasChildren {

    public name: Type = new Type("class name");
    private members: Array<Member> = new Array<Member>();
    public abstract: boolean = false;
    public immutable: boolean = false;

    constructor() {
        super();
        this.htmlId = `class${this.nextId()}`;
        this.multiline = true;
    }

    private get constr() {
        return this.members[0] as Constructor;
    }

    get asString() {
        return this.members[this.members.length -1] as AsString;
    }

    public override selectFirstText(): boolean {
        this.name.select();
        return true;
    }

    selectFirstChild(): boolean {
        if (this.members.length > 0){
            this.members[0].select();
            return true;
        }
        return false;
    }

    selectLastChild(): void {
        this.members[this.members.length - 1].select();
    }

    selectChildAfter(child: Frame): void {
        if (isMember(child)) {
            const index = this.members.indexOf(child);
            safeSelectAfter(this.members, index);
        }
    }
    selectChildBefore(child: Frame): void {
        if (isMember(child)) {
            const index = this.members.indexOf(child);
            safeSelectBefore(this.members, index);
        }
    }

    selectChildRange(): void {
        selectChildRange(this.members);
    }

    public override initialize(frameMap: Map<string, Frame>, parent?: Frame | undefined): void {
        super.initialize(frameMap, parent);
        this.addFixedMember(new Constructor());
        this.addFixedMember(new MemberSelector());
        this.addFixedMember(new AsString());
        this.name.initialize(frameMap, this);
    }

    isGlobal = true;

    private modifiersAsHtml(): string {
        return `${this.abstract ? "<keyword>abstract </keyword>" : ""}${this.immutable ? "<keyword>immutable </keyword>" : ""}`;
    }
    private modifiersAsSource(): string {
        return `${this.abstract ? "abstract " : ""}${this.immutable ? "immutable " : ""}`;
    }

    public renderAsHtml(): string {
        const ss: Array<string> = [];
        for (var m of this.members) {
            ss.push(m.renderAsHtml());
        }
        const members = ss.join("\n");
        return `<classDef class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand>${this.modifiersAsHtml()}<keyword>class </keyword>${this.name.renderAsHtml()}</top>
${members}
<keyword>end class</keyword>
</classDef>`;
    }

    indent(): string {
        return "";
    }

    public renderAsSource(): string {
        const ss: Array<string> = [];
        for (var m of this.members) {
            var s = m.renderAsSource();
            ss.push(s);
        }
        const members = ss.join("\r\n");
        return `${this.modifiersAsSource()}class ${this.name.renderAsSource()}\r
${members}\r
end class\r\n`;
    }

    private addFixedMember(m: Member) {
        m.initialize(this.frameMap, this);
        this.members.push(m);
    }

    public addMember(m: Member) {
        m.initialize(this.frameMap, this);
        const asString = this.members.pop();
        this.members.push(m);
        this.members.push(asString!);
    }
}