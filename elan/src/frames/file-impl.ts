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
import { isCollapsible } from "./helpers";
import { Frame } from "./interfaces/frame";
import { Parent } from "./interfaces/parent";
import { CodeSource, CodeSourceFromString } from "./code-source";
import { Regexes } from "./fields/regexes";
import { GlobalSelector } from "./globals/global-selector";

// for web editor bundle
export { CodeSourceFromString };

export class FileImpl implements File {
    isParent: boolean = true;
    hasFields: boolean = true;
    isFile: boolean = true;
    parseError?: string;

    private _globals: Array<Frame> = new Array<Frame>();
    private _map: Map<string, Selectable>;
    private _factory: StatementFactory;
    private ignoreHashOnParsing: boolean = false;

    constructor(private hash: (toHash: string) => string, ignoreHashOnParsing?: boolean) {
        this._map = new Map<string, Selectable>();
        this._factory = new StatementFactoryImpl();
        this._globals.push(new GlobalSelector(this));
        if (ignoreHashOnParsing) {
            this.ignoreHashOnParsing = ignoreHashOnParsing;
        }
    }
    moveDownOne(child: Frame): void {
        var i = this._globals.indexOf(child);
        this._globals.splice(i,1);
        this._globals.splice(i+1,0,child);  
    }
    moveUpOne(child: Frame): void {
        var i = this._globals.indexOf(child);
        this._globals.splice(i,1);
        this._globals.splice(i-1,0,child);     
    }

    minimumNumberOfChildrenExceeded(): boolean {
        return this._globals.length > 1;
    }

    removeChild(child: Frame): void {
        var i = this._globals.indexOf(child);
        this._globals.splice(i,1);
    }

    getLastFieldOrSuitableFrame(): Selectable {
        return this._globals[0];
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
        if (this.parseError){
            return `<parseError>${this.parseError}</parseError>`;
        }

        const ss: Array<string> = [];
        for (var global of this._globals) {
            ss.push(global.renderAsHtml());
        }
        const globals = ss.join("\n");
        return `<header># <hash>${this.getHash()}</hash> ${this.getVersion()} <span id="fileStatus" class="${this.statusAsString()}">${this.statusAsString()}</span></header>\r\n${globals}`;
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

    renderGlobalsAsSource() : string{
        var result = "";
        if (this._globals.length > 0) {
            const ss: Array<string> = [];
            for (var frame of this._globals.filter(g => !('isSelector' in g))) {
                ss.push(frame.renderAsSource());
            }
            result = ss.join("\r\n");
        }
        return result;
    }

    renderAsObjectCode() : string{
        var result = "";
        if (this._globals.length > 0) {
            const ss: Array<string> = [];
            for (var frame of this._globals.filter(g => !('isSelector' in g))) {
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

    renderHashableContent(): string {
        const globals = this.renderGlobalsAsSource();
        return `${this.getVersion()} ${this.statusAsString()}\r\n\r\n${globals}`; 
    }

    public addGlobal(g: Frame) : void {
        this._globals.push(g);
    }

    public getFirstGlobalSelector() : GlobalSelector {
        return this._globals.filter(g => ('isSelector' in g))[0] as GlobalSelector;
    }

    public addGlobalBefore(g: Frame, before: Frame): void {
        var i = this._globals.indexOf(before);
        this._globals.splice(i,0,g);
    }

    public addGlobalAfter(g: Frame, after: Frame) {
        var i = this._globals.indexOf(after)+1;
        this._globals.splice(i,0,g);     
    }

    public removeGlobal(g: Frame) {
        var i = this._globals.indexOf(g);
        this._globals.splice(i,1);    
    }
    
    getFirstChild(): Frame {
        return this._globals[0]; //Should always be one - at minimum a SelectGlobal
    }

    getLastChild(): Frame {
        return this._globals[this._globals.length - 1];
    }

    getChildAfter(g: Frame): Frame {
        const index = this._globals.indexOf(g);
        return index < this._globals.length - 1 ? this._globals[index +1] : g;
    }

    getChildBefore(g: Frame): Frame {
        const index = this._globals.indexOf(g);
        return index > 0 ? this._globals[index -1] : g;
    }

    getChildRange(first: Frame, last: Frame): Frame[] {
        var fst = this._globals.indexOf(first);
        var lst = this._globals.indexOf(last);
        return fst < lst ? this._globals.slice(fst, lst + 1) : this._globals.slice(lst, fst + 1);
    }

    defocusAll() {
        for (const f of this._map.values()) {
            if (f.isFocused()) {
                f.defocus();
            }
        }
    }

    expandCollapseAll() {
        for (const f of this._map.values()) {
            if (isCollapsible(f)) {
               f.expandCollapse();
            }
        }
    }

    expand(): void {
        //Does nothing
    }
    collapse(): void {
        //does nothing
    }

    status(): ParseStatus {
        return this._globals.map(g => g.getStatus()).reduce((prev, cur) => cur < prev ? cur : prev, ParseStatus.valid);
    }

    statusAsString() : string {
        return ParseStatus[this.status()];
    }

    deselectAll(): void {
        const v = this.getMap().values()!;
        var selected =  [...v].filter(s => s.isSelected());
        selected.forEach(s => s.deselect());
    }

    getMap(): Map<string, Selectable> {
        return this._map;
    }
    getFactory(): StatementFactory {
        return this._factory;
    }

    addMainBefore(g: Frame): Frame {
        var m = new MainFrame(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    addFunctionBefore(g: Frame): Frame {
        var m = new Function(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    addProcedureBefore(g: Frame): Frame {
        var m = new Procedure(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    addEnumBefore(g: Frame): Frame {
        var m = new Enum(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    addClassBefore(g: Frame): Frame {
        var m = new Class(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    addGlobalCommentBefore(g: Frame): Frame {
        var m = new GlobalComment(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    addConstantBefore(g: Frame): Frame {
        var m = new Constant(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    addTestBefore(g: Frame): Frame {
        var m = new Test(this);
        return this.addGlobalBeforeAndSelectFirstField(m,g);
    }
    private addGlobalBeforeAndSelectFirstField(g: Frame, before: Frame): Frame {
        this.addGlobalBefore(g, before);
        g.selectFirstFieldOrSuitableFrame();
        return g;
    }

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
                    this.getFirstGlobalSelector().parseFrom(source);
                }
            }
        } catch (e) {
            this.parseError = `Parse error before: ${source.getRemainingCode().substring(0, 100)}: ${e instanceof Error ? e.message : e}`;
        }
    }

    containsMain(): boolean {
        var mains = this._globals.filter(g => 'isMain' in g);
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

    insertGlobalSelector(after: boolean, existing: Frame): void {
        var selector =  new GlobalSelector(this);
        if (after) {
            if (existing.canInsertAfter()) {
                this.addGlobalAfter(selector, existing);
            }
        } else {
            if (existing.canInsertBefore()) {
                this.addGlobalBefore(selector, existing);
            }
        }
        selector.select(true, false);
    }
}