import { AbstractFrame } from "./abstract-frame";
import { AbstractSelector } from "./abstract-selector";
import { CodeSource } from "./code-source";
import { Regexes } from "./fields/regexes";
import { Collapsible } from "./interfaces/collapsible";
import { Field } from "./interfaces/field";
import { Frame } from "./interfaces/frame";
import { Parent } from "./interfaces/parent";
import { Profile } from "./interfaces/profile";
import { StatementFactory } from "./interfaces/statement-factory";
import { parentHelper_addChildAfter, parentHelper_addChildBefore, parentHelper_getChildAfter, parentHelper_getChildBefore, parentHelper_getChildRange, parentHelper_getFirstChild, parentHelper_getFirstSelectorAsDirectChild, parentHelper_getLastChild, parentHelper_insertChildSelector, parentHelper_moveSelectedChildrenDownOne, parentHelper_moveSelectedChildrenUpOne, parentHelper_removeChild, parentHelper_renderChildrenAsHtml, parentHelper_renderChildrenAsSource, parentHelper_selectFirstChild, parentHelper_selectLastField, parentHelper_worstStatusOfChildren } from "./parent-helpers";
import { ParseStatus } from "./parse-status";
import { StatementSelector } from "./statements/statement-selector";

export abstract class FrameWithStatements extends AbstractFrame implements Parent, Collapsible{
    isCollapsible: boolean = true;
    isParent: boolean = true;
    private _children: Array<Frame> = new Array<Frame>();

    constructor(parent: Parent) {
        super(parent);   
        this.getChildren().push(new StatementSelector(this));
    }
    getProfile(): Profile {
        return this.getParent().getProfile();
    }

    protected setClasses() {
        super.setClasses();
        this.pushClass(true,"multiline");
    };

    getFactory(): StatementFactory {
        return this.getParent().getFactory();
    }

    getStatus(): ParseStatus {
        //var frameStatus = this.frameStatus();
        var fieldStatus = this.worstStatusOfFields();
        var statementsStatus = parentHelper_worstStatusOfChildren(this);
        var worst = [/*frameStatus,*/ fieldStatus, statementsStatus].sort((a, b) => a - b)[0];

        return worst;
    }

    getChildren(): Frame[] {
        return this._children;
    }

    minimumNumberOfChildrenExceeded(): boolean {
        return this.getChildren().length > 1;
    }

    expandCollapse(): void {
        if (this.isCollapsed()) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    newChildSelector(): AbstractSelector {
        return new StatementSelector(this);
    }
    insertChildSelector(after: boolean, child: Frame) {parentHelper_insertChildSelector(this, after, child);}

    removeChild(child: Frame): void { parentHelper_removeChild(this, child);};
    getFirstChild(): Frame {return parentHelper_getFirstChild(this); }
    getLastChild(): Frame {return parentHelper_getLastChild(this); }
    getChildAfter(child: Frame): Frame {return parentHelper_getChildAfter(this, child);}
    getChildBefore(child: Frame): Frame {return parentHelper_getChildBefore(this, child);}
    getChildRange(first: Frame, last: Frame): Frame[] {return parentHelper_getChildRange(this, first, last); }
    getFirstSelectorAsDirectChild() : AbstractSelector {return parentHelper_getFirstSelectorAsDirectChild(this);}
    selectFirstChild(multiSelect: boolean): boolean {return parentHelper_selectFirstChild(this, multiSelect);}
    addChildBefore(child: Frame, before: Frame): void {parentHelper_addChildBefore(this, child, before);}
    addChildAfter(child: Frame, before: Frame): void {parentHelper_addChildAfter(this, child, before);}
    selectLastField(): boolean {return parentHelper_selectLastField(this);}

    protected renderChildrenAsHtml(): string {return parentHelper_renderChildrenAsHtml(this);}
    protected renderChildrenAsSource() : string {return parentHelper_renderChildrenAsSource(this);}
    
    selectFirstField(): boolean {
        var result = super.selectFirstField();
        if (!result) {
            result = this.getChildren()[0].selectFirstField();
        }
        return result;
    } 

    selectFieldBefore(current: Field): void {
        if (this.getFields().includes(current)) {
            super.selectFieldBefore(current);
        } else{
         this.getLastChild().selectLastField();
        }
    }

    selectFirstChildIfAny(): boolean {
        var result = false;
        if (this.getChildren().length > 0) {
            this.getChildren()[0].select(true, false);
            result = true;
        }
        return result;
    }

    moveSelectedChildrenUpOne(): void {parentHelper_moveSelectedChildrenUpOne(this);}
    moveSelectedChildrenDownOne(): void {parentHelper_moveSelectedChildrenDownOne(this);}

    parseFrom(source: CodeSource): void {
        this.parseTop(source);
        while (!this.parseBottom(source)) {
            if (source.isMatchRegEx(Regexes.startsWithNewLine)) {
                source.removeRegEx(Regexes.startsWithNewLine, false);
                source.removeIndent();
            } else {
                this.getFirstSelectorAsDirectChild().parseFrom(source);
            }
        } 
    }

    abstract parseTop(source: CodeSource): void;
    abstract parseBottom(source: CodeSource): boolean;

    protected parseStandardEnding(source: CodeSource, keywords: string): boolean {
        source.removeIndent();
        var result = false;
        if (source.isMatch(keywords)) {
            source.remove(keywords);
            result = true;
        }
        return result;
    }

    protected renderStatementsAsObjectCode() : string {
        var result = "";
        if (this._children.length > 0 ) {
            const ss: Array<string> = [];
            for (var frame of this._children.filter(s => !('isSelector' in s))) {
                ss.push(frame.renderAsObjectCode());
            }
            result = ss.join("\r\n");
        }
        return result;
    }
}