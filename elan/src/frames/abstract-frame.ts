import { Parent} from "./interfaces/parent";
import { Selectable } from "./interfaces/selectable";
import { expandCollapseAll, isCollapsible, isFile, isFrame, isParent, singleIndent } from "./helpers";
import { ParseStatus } from "./parse-status";
import { Frame } from "./interfaces/frame";
import { File } from "./interfaces/file";
import { Field } from "./interfaces/field";
import { editorEvent } from "./interfaces/editor-event";
import { CodeSource } from "./code-source";

export abstract class AbstractFrame implements Frame {  
    isFrame = true;
    private _parent: File | Parent;
    private _map?: Map<string, Selectable>;
      private selected: boolean = false;
    private focused: boolean = false;
    private collapsed: boolean = false;
    private _classes = new Array<string>;
    protected htmlId: string = "";
    protected movable: boolean = true;

    constructor(parent: Parent) {
        this._parent = parent;
        var map = parent.getMap();
        this.htmlId = `${this.getIdPrefix()}${map.size}`;
        map.set(this.htmlId, this);
        this.setMap(map);
    }

    frameStatus(): ParseStatus {
        return ParseStatus.valid;
    }

    renderAsObjectCode(): string {
        throw new Error("Method not implemented.");
    }

    fieldUpdated(field: Field): void {
        //Does nothing - for sub-classes to override as needed
    }

    abstract getFields(): Field[];
    
    worstStatusOfFields(): ParseStatus {
        return this.getFields().map(g => g.getStatus()).reduce((prev, cur) => cur < prev ? cur : prev, ParseStatus.valid);
    }
    getFirstPeerFrame(): Frame {
        return this.getParent().getFirstChild();
    }
    getLastPeerFrame(): Frame {
        return this.getParent().getLastChild();
    }
    getPreviousPeerFrame(): Frame {
        return this.getParent().getChildBefore(this);
    }
    getNextPeerFrame(): Frame {
        return this.getParent().getChildAfter(this);
    }

    selectFieldBefore(current: Field) {
        var fields = this.getFields();
        var i = fields.indexOf(current);
        if (i > 0) {
            fields[i-1].select(true, false);
        } else {
           this.selectLastFieldAboveThisFrame();
        }
    }

    selectFieldAfter(current: Field) {
        var fields = this.getFields();
        var i = fields.indexOf(current);
        if (i < fields.length - 1) {
            fields[i+1].select(true, false);
        } else {
            if (isParent(this)){
                this.getFirstChild().selectFirstField();
            } else {
                var next = this.getNextFrameInTabOrder();
                if (next !== this) {
                    next.selectFirstField();
                }
            }
        }
    }

    getNextFrameInTabOrder(): Frame {
        var result: Frame = this;
        if (this.getNextPeerFrame() !== this) {
            result = this.getNextPeerFrame();
        } else {
            var parent = this.getParent();
            if (isFrame(parent)) {
                var parentNextPeer = parent.getNextFrameInTabOrder();
                if (parentNextPeer !== parent) {
                    result = parentNextPeer;
                }
            }
        }
        return result;
    }

    getPreviousFrameInTabOrder(): Frame {
        var result: Frame = this;
        if (this.getPreviousPeerFrame() !== this) {
            result = this.getPreviousPeerFrame();
        } else {
            var parent = this.getParent();
            if (isFrame(parent)) {
                result = parent.getPreviousFrameInTabOrder();
            }
        }
        return result;
    }

    //Overridden by any frames that have children
    selectFirstField(): boolean {
        var result = false;
        if (this.getFields().length > 0) {
          this.getFields()[0].select(true, false);
          result = true;
        } 
        return result;
    } 

    selectLastField(): boolean {
        var result = false;
        var n = this.getFields().length;
        if (n > 0) {
          this.getFields()[n -1].select(true, false);
          result = true;
        } 
        return result;
    }

    processKey(e: editorEvent): void {
        var key = e.key;
        switch (key) {
          case 'Escape': {this.deselectAll(); break;}
          case "Home": {this.getFirstPeerFrame().select(true, false); break;}
          case "End": {this.getLastPeerFrame().select(true, false); break;}
          case "Tab": {this.tabOrEnter(e.modKey.shift); break;} 
          case "Enter": {this.tabOrEnter(e.modKey.shift); break;}  
          case "Insert": {this.insertPeerSelector(e.modKey.shift); break;} 
          case "o": {if (e.modKey.control && isCollapsible(this)) {this.expandCollapse();} break;}
          case 'O': {if (e.modKey.control) {this.expandCollapseAll();} break;}
          case "ArrowUp": {
            if (e.modKey.control && this.movable) {
                this.getParent().moveSelectedChildrenUpOne();
            } else {
                this.selectSingleOrMulti(this.getPreviousPeerFrame(), e.modKey.shift);
            }
            break;
          }
          case "ArrowDown": {
            if (e.modKey.control && this.movable) {
                  this.getParent().moveSelectedChildrenDownOne();         
            } else {
                this.selectSingleOrMulti(this.getNextPeerFrame(), e.modKey.shift);
            }
            break;
          }
          case "ArrowLeft": {
            var pt = this.getParent();
            if (isFrame(pt)) {
                pt.select(true, false);
            }
            break;
          }
          case "ArrowRight": {if (isParent(this)) { this.getFirstChild().select(true, false);} break;}
          case "Delete": {if (e.modKey.control) {this.deleteIfPermissible();} break;}
          case "d": {if (e.modKey.control) {this.deleteIfPermissible();} break;}
        } 
    }

    deleteIfPermissible(): void {
        if(! this.getParent().minimumNumberOfChildrenExceeded()) {
            this.insertPeerSelector(true);
        }
        this.getParent().removeChild(this);
        this.getMap().delete(this.htmlId);
    }

    insertPeerSelector(after: boolean): void { //Overridden by Global frames that inherit from this
        var parent =this.getParent();
        if (after && this.canInsertAfter()) {
            parent.insertChildSelector(true, this);
        } else if (!after && this.canInsertBefore()) {
            parent.insertChildSelector(false, this);
        } 
    }

    canInsertBefore(): boolean { return true; }

    canInsertAfter(): boolean { return true;}

    tabOrEnter(back: boolean) {
        if (back) {
           this.selectLastFieldAboveThisFrame();
        } else {
            this.selectFirstField();
        }
    }

    selectLastFieldAboveThisFrame(): boolean {
        var result = false;
        var peer = this.getPreviousPeerFrame();
        if (peer !== this) {
            result = peer.selectLastField();
        } else {
            var parent = this.getParent();
            var fields = parent.getFields();
            var n = fields.length;
            if (n > 0) {
                fields[n -1].select(true, false);
                result = true;
            } else {
                if (isFrame(parent) && parent.getFields().length === 0) { //e.g. main or default
                    result =  this.selectLastFieldInPreviousGlobal(parent.getParent() as File, parent);
                } else if (isFile(parent)) {
                    result = this.selectLastFieldInPreviousGlobal(parent, this);
                }               
            }
        }
        return result;
    }

    private selectLastFieldInPreviousGlobal(file: File, frame: Frame) : boolean {
        var result = false;
        var prior = file.getChildBefore(frame);
        if (prior !== frame ) {
            prior.selectLastField();  
            result = true;
        }
        return result;
    }

    private selectSingleOrMulti(s: Frame, multiSelect: boolean) {
        if (multiSelect) {
            this.select(false, true);
            s.select(true, true);
        }
        else {
            s.select(true, false);
        }
    }

    getMap(): Map<string, Selectable> {
        if (this._map) {
            return this._map;
        }
        throw new Error(`Frame : ${this.htmlId} has no Map`);
    }

    setMap(Map: Map<string, Selectable>) {
        this._map = Map;
    }

    abstract getIdPrefix(): string;

    protected pushClass(flag: boolean, cls: string) {
        if (flag) {
            this._classes.push(cls);
        }
    }

    protected setClasses() {
        this._classes = new Array<string>();
        this.pushClass(this.collapsed, "collapsed");
        this.pushClass(this.selected, "selected");
        this.pushClass(this.focused, "focused");
        this._classes.push(ParseStatus[this.getStatus()]);
    };

    protected cls(): string {
        this.setClasses();
        return this._classes.join(" ");
    };

    abstract renderAsHtml(): string;

    indent(): string {
        if (this.hasParent()) {
            return this.getParent()?.indent() + singleIndent();
        } else {
            return singleIndent();
        }
    }

    abstract renderAsSource(): string;

    isSelected(): boolean {
        return this.selected;
    }

    select(withFocus : boolean,  multiSelect: boolean): void {
        if (!multiSelect) {
            this.deselectAll();
        }
        this.selected = true; 
        this.focused = withFocus;
    }

    deselect(): void {
        this.selected = false;
        this.focused = false;
    }

    deselectAll() {
        for (const f of this.getMap().values()) {
            if (f.isSelected()) {
                f.deselect();
            }
        }
    }

    getAllSelected(): Selectable[] {
        var selected = [];
        for (const f of this.getMap().values()) {
            if (f.isSelected()) {
                selected.push(f);
            }
        }
        return selected;
    }

    hasParent(): boolean {
        return !!this._parent;
    }

    setParent(parent: Parent): void {
        this._parent = parent;
    }

    getParent(): Parent {
        if (this._parent) {
            return this._parent;
        }
        throw new Error(`Frame : ${this.htmlId} has no Parent`);
    }

    expandCollapse(): void {
        if (this.isCollapsed()) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    expandCollapseAll() {
        expandCollapseAll(this.getMap());
    }

    isCollapsed(): boolean {
        return this.collapsed;
    }

    collapse(): void {
        if ('isCollapsible' in this) {
            this.collapsed = true;
        }
    }

    expand(): void {
        if ('isCollapsible' in this) {
            this.collapsed = false;
        }
    }

    isFocused(): boolean {
        return this.focused;
    }

    focus(): void {
        this.focused = true;
    }

    defocus(): void {
        this.focused = false;
    }

    isComplete(): boolean {
        return true;
    }

    getStatus(): ParseStatus {
        //var frameStatus = this.frameStatus();
        var fieldStatus = this.worstStatusOfFields();
        //return fieldStatus < frameStatus ? fieldStatus : frameStatus;
        return fieldStatus;
    }

    abstract parseFrom(source: CodeSource): void;

}