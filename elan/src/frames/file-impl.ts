import { Selectable } from "./interfaces/selectable";
import { StatementFactory } from "./interfaces/statement-factory";
import { ParseStatus } from "./parse-status";
import { File} from "./interfaces/file";
import { MainFrame } from "./globals/main-frame";
import { Function } from "./globals/function";
import { Procedure } from "./globals/procedure";
import { Enum } from "./globals/enum";
import { Class } from "./globals/class";
import { GlobalComment } from "./globals/global-comment";
import { Constant } from "./globals/constant";
import { Test } from "./globals/test";
import { StatementFactoryImpl } from "./statement-factory-impl";
import { expandCollapseAll, isCollapsible, isSelector } from "./helpers";
import { Frame } from "./interfaces/frame";
import { Parent } from "./interfaces/parent";
import { CodeSource, CodeSourceFromString } from "./code-source";
import { Regexes } from "./fields/regexes";
import { GlobalSelector } from "./globals/global-selector";
import { Field } from "./interfaces/field";
import { editorEvent } from "./interfaces/editor-event";
import { AbstractSelector } from "./abstract-selector";
import { parentHelper_addChildAfter, parentHelper_addChildBefore, parentHelper_getChildAfter, parentHelper_getChildBefore, parentHelper_getChildRange, parentHelper_getFirstChild, parentHelper_getLastChild, parentHelper_insertChildSelector, parentHelper_removeChild, parentHelper_renderChildrenAsHtml, parentHelper_renderChildrenAsSource, parentHelper_worstStatusOfChildren } from "./parent-helpers";
import { Profile } from "./interfaces/profile";

// for web editor bundle
export { CodeSourceFromString };

//var system; export function _inject(l) { system = l; };

export class FileImpl implements File {
    isParent: boolean = true;
    hasFields: boolean = true;
    isFile: boolean = true;
    parseError? : string;
 
    private _children: Array<Frame> = new Array<Frame>();
    private _map: Map<string, Selectable>;
    private _factory: StatementFactory;
    private ignoreHashOnParsing: boolean = false;

    constructor(private hash: (toHash: string) => string, private profile : Profile, ignoreHashOnParsing?: boolean) {
        this._map = new Map<string, Selectable>();
        this._factory = new StatementFactoryImpl();
        this.getChildren().push(new GlobalSelector(this));
        if (ignoreHashOnParsing) {
            this.ignoreHashOnParsing = ignoreHashOnParsing;
        }
    }

    getProfile() : Profile {
        return this.profile;
    }

    getChildren(): Frame[] {
        return this._children;
    }

    private moveDownOne(child: Frame): boolean {
        var result = false;
        var i = this.getChildren().indexOf(child);
        if (i < this.getChildren().length - 1) {
            this.getChildren().splice(i,1);
            this.getChildren().splice(i+1,0,child);
            result = true;
        }  
        return result;
    }
    private moveUpOne(child: Frame): boolean {
        var result = false;
        var i = this.getChildren().indexOf(child);
        if (i > 0) {
            this.getChildren().splice(i,1);
            this.getChildren().splice(i-1,0,child); 
            return result = true;  
        }  
        return result;
    }
    moveSelectedChildrenUpOne(): void {
        var toMove = this.getChildren().filter(g => g.isSelected()); 
        var cont = true;
        var i = 0;
        while (cont && i < toMove.length) {
            cont = this.moveUpOne(toMove[i]);
            i++;
        }
    }
    moveSelectedChildrenDownOne(): void {
        var toMove = this.getChildren().filter(g => g.isSelected());
        var cont = true;
        var i = toMove.length - 1;
        while (cont && i >= 0) {
            cont = this.moveDownOne(toMove[i]);
            i--;
        }
    }
    minimumNumberOfChildrenExceeded(): boolean {
        return this.getChildren().length > 1;
    }

    hasParent(): boolean {
        return false;
    }

    getParent(): Parent {
        throw new Error("getParent Should not have been called on a file; test for 'hasParent()' before calling.");
    }
    
    getById(id: string): Selectable {
        return this._map.get(id) as Selectable;
    }

    getIdPrefix(): string {
        return 'file';
    }

    public renderAsHtml(): string {
        var globals = parentHelper_renderChildrenAsHtml(this);
        return `<header># <hash>${this.getHash()}</hash> ${this.getVersion()}${this.getProfileName()} <span id="fileStatus" class="${this.statusAsString()}">${this.statusAsString()}</span></header>\r\n${globals}`;
    }

    public indent(): string {
        return "";
    }

    private getHash(body? : string): string {
        body = (body || this.renderHashableContent()).trim().replaceAll("\r", "");
        return this.hash(body);
    }

    private getVersion() {
        return "Elan v0.1";
    }

    private getProfileName() {
        var profile = this.getProfile();
        return profile.include_profile_name_in_header ? ` ${profile.name}` : "";
    }

    renderGlobalsAsObjectCode() : string{
        var result = "";
        if (this._children.length > 0) {
            const ss: Array<string> = [];
            for (var frame of this._children.filter(g => !('isSelector' in g))) {
                ss.push(frame.renderAsObjectCode());
            }
            result = ss.join("\r\n");
        }
        return result;
    }

    renderAsSource(): string {
        const content = this.renderHashableContent();
        return `# ${this.getHash(content)} ${content}`; 
    }

    renderAsObjectCode(): string {
        const stdLib = 'var system; export function _inject(l) { system = l; };';
        return `${stdLib}\n${this.renderGlobalsAsObjectCode()}`; 
    }

    renderHashableContent(): string {
        const globals = parentHelper_renderChildrenAsSource(this);
        return `${this.getVersion()}${this.getProfileName()} ${this.statusAsString()}\r\n\r\n${globals}`; 
    }

    public getFirstSelectorAsDirectChild() : AbstractSelector {
        return this.getChildren().filter(g => ('isSelector' in g))[0] as GlobalSelector;
    }

    getChildNumber(n: number): Frame {
        return this.getChildren()[n];
    }
    
    getFirstChild(): Frame {return parentHelper_getFirstChild(this); }
    getLastChild(): Frame {return parentHelper_getLastChild(this); }
    getChildAfter(child: Frame): Frame {return parentHelper_getChildAfter(this, child);}
    getChildBefore(child: Frame): Frame {return parentHelper_getChildBefore(this, child);}
    getChildRange(first: Frame, last: Frame): Frame[] {return parentHelper_getChildRange(this, first, last); }
    addChildBefore(child: Frame, before: Frame): void {parentHelper_addChildBefore(this, child, before);}
    addChildAfter(child: Frame, before: Frame): void {parentHelper_addChildAfter(this, child, before);}
    removeChild(child: Frame): void { parentHelper_removeChild(this, child);};
        insertChildSelector(after: boolean, child: Frame) {parentHelper_insertChildSelector(this, after,child);}

    defocusAll() {
        for (const f of this._map.values()) {
            if (f.isFocused()) {
                f.defocus();
            }
        }
    }

    expandCollapseAll() {
        expandCollapseAll(this._map);
    }

    expand(): void {
        //Does nothing
    }
    collapse(): void {
        //does nothing
    }

    status(): ParseStatus {
        return parentHelper_worstStatusOfChildren(this);
    }

    statusAsString() : string {
        return ParseStatus[this.status()];
    }

    getAllSelected(): Selectable[] {
        const v = this.getMap().values()!;
        return  [...v].filter(s => s.isSelected());
    }

    deselectAll(): void {
        this.getAllSelected().forEach(s => s.deselect());
    }

    getMap(): Map<string, Selectable> {
        return this._map;
    }
    getFactory(): StatementFactory {
        return this._factory;
    }

    createMain(): Frame {return new MainFrame(this);}
    createFunction(): Frame {return  new Function(this);}
    createProcedure(): Frame {return  new Procedure(this);}
    createEnum(): Frame {return  new Enum(this);}
    createClass(): Frame {return  new Class(this);}
    createGlobalComment(): Frame {return  new GlobalComment(this);}
    createConstant(): Frame {return  new Constant(this);}
    createTest(): Frame {return  new Test(this);}

    parseFrom(source: CodeSource): void {
        try {
            this.parseError = undefined;
            this.validateHeader(source.getRemainingCode());
            if (source.isMatch("#")) {
                source.removeRegEx(Regexes.startsWithComment, false);
                source.removeRegEx(Regexes.startsWithNewLine, false);
                source.removeRegEx(Regexes.startsWithNewLine, false);
            }
            while (source.hasMoreCode()) {
                if (source.isMatchRegEx(Regexes.startsWithNewLine)) {
                    source.removeNewLine();
                } else {
                    this.getFirstSelectorAsDirectChild().parseFrom(source);
                }
            }
            this.removeAllSelectorsThatCanBe();
            this.deselectAll();
        } catch (e) {
            this.parseError = `Parse error before: ${source.getRemainingCode().substring(0, 100)}: ${e instanceof Error ? e.message : e}`;
        }
    }

    containsMain(): boolean {
        var mains = this.getChildren().filter(g => 'isMain' in g);
        return mains.length > 0;
    }

    validateHeader(code: string) {
        if (!this.ignoreHashOnParsing && !this.isEmpty(code)) {
            const eol = code.indexOf("\n");
            const header = code.substring(0, eol > 0 ? eol : undefined);
            const tokens = header.split(" ");
            if (tokens.length !== 5 || tokens[0] !== "#" || tokens[2] !== "Elan") {
                throw new Error("Invalid file header format");
            }
            const fileHash = tokens[1];
            const toHash = code.substring(code.indexOf("Elan"));
            const newHash = this.getHash(toHash);

            if (fileHash !== newHash) {
                throw new Error("Code does not match the hash in the file header");
            }
        }
    }

    private isEmpty(code: string): boolean {
        var matches = code.match(/^[\s\r\n]*$/);
        return matches !== null && matches.length > 0;
    }

    getFields(): Field[] {
        return [];
    }

    processKey(e: editorEvent): void {
        switch (e.key) {
            case 'Home': {this.selectFirstGlobal(); break;}
            case 'End': {this.getLastChild().select(true, false); break;}
            case 'Tab': {this.tabOrEnter(e.modKey.shift); break;}
            case 'Enter': {this.tabOrEnter(e.modKey.shift); break;}
            case 'ArrowDown':  {this.selectFirstGlobal(); break;}
            case 'ArrowRight':  {this.selectFirstGlobal(); break;}
            case 'O': {if (e.modKey.control) {this.expandCollapseAll();} break;}
        }
    } 

    private selectFirstGlobal(): void {
        this.getFirstChild().select(true, false);
    }

    private tabOrEnter(back: boolean) {
        if (back) {
            this.getLastChild().selectLastField();
        } else {
            this.getFirstChild().selectFirstField();
        }
    }

    newChildSelector(): AbstractSelector {
        return new GlobalSelector(this);
    }

    removeAllSelectorsThatCanBe(): void {
        for (const f of this.getMap().values()) {
            if (isSelector(f)) {
                f.deleteIfPermissible();
            }
        }
    }
}