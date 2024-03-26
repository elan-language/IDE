import { StatementFactory } from "../interfaces/statement-factory";
import { FrameWithStatements } from "../frame-with-statements";
import { AbstractSelector } from "../abstract-selector";
import { Parent } from "../interfaces/parent";
import { Frame } from "../interfaces/frame";
import { assertKeyword, callKeyword, caseKeyword, catchKeyword, defaultKeyword, eachKeyword, elseKeyword, forKeyword, ifKeyword, printKeyword, repeatKeyword, returnKeyword, setKeyword, switchKeyword, throwKeyword, tryKeyword, varKeyword, whileKeyword, testKeyword, commentMarker, inputKeyword, externalKeyword } from "../keywords";

export class StatementSelector extends AbstractSelector  {
    isStatement = true;
    private factory: StatementFactory;

    constructor(parent: FrameWithStatements) {
        super(parent);
        this.factory = (parent.getFactory());
    }

    getDefaultOptions(): [string, (parent: Parent) => Frame][] {
        return [
        [assertKeyword, (parent: Parent) => this.factory.newAssert(parent)],
        [callKeyword, (parent: Parent) => this.factory.newCall(parent)],
        [caseKeyword, (parent: Parent) => this.factory.newCase(parent)],
        [catchKeyword, (parent: Parent) => this.factory.newCatch(parent)],
        [defaultKeyword, (parent: Parent) => this.factory.newDefault(parent)],
        [eachKeyword, (parent: Parent) => this.factory.newEach(parent)],
        [elseKeyword, (parent: Parent) => this.factory.newElse(parent)],
        [externalKeyword, (parent: Parent) => this.factory.newExternal(parent)],
        [forKeyword, (parent: Parent) => this.factory.newFor(parent)],
        [ifKeyword, (parent: Parent) => this.factory.newIf(parent)],
        [inputKeyword, (parent: Parent) => this.factory.newInput(parent)],
        [printKeyword, (parent: Parent) => this.factory.newPrint(parent)],
        [repeatKeyword, (parent: Parent) => this.factory.newRepeat(parent)],
        [returnKeyword, (parent: Parent) => this.factory.newReturn(parent)],
        [setKeyword, (parent: Parent) => this.factory.newSet(parent)],
        [switchKeyword, (parent: Parent) => this.factory.newSwitch(parent)],
        [throwKeyword, (parent: Parent) => this.factory.newThrow(parent)],
        [tryKeyword, (parent: Parent) => this.factory.newTryCatch(parent)],
        [varKeyword, (parent: Parent) => this.factory.newVar(parent)],
        [whileKeyword, (parent: Parent) => this.factory.newWhile(parent)],
        [commentMarker, (parent: Parent) => this.factory.newComment(parent)]
        ];
    }

    profileAllows(keyword: string): boolean {
        return this.profile.statements.includes(keyword);
    }

    validForEditorWithin(keyword: string): boolean {
        if (this.getParent().getIdPrefix() === testKeyword ) {
            return keyword === assertKeyword ||keyword === callKeyword || keyword === varKeyword;
        } else if (this.getParent().getIdPrefix() === switchKeyword) {
            return keyword === caseKeyword;     
        } else if (keyword === returnKeyword || keyword === assertKeyword || keyword === caseKeyword || keyword === catchKeyword || keyword === defaultKeyword) {
            return false;
        } else if (keyword === elseKeyword ) {
            return this.getParent().getIdPrefix() === ifKeyword ;
        } else if (keyword === printKeyword || keyword === callKeyword || keyword === inputKeyword || keyword === externalKeyword) {
            return !this.isWithinAFunction(this.getParent());
        } else {
            return true;
        }
    }

    private isWithinAFunction(parent: Parent): boolean {
        return parent.getIdPrefix() === 'func' ? true : parent.hasParent() && this.isWithinAFunction(parent.getParent());
    }
    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0">${this.textToDisplayAsHtml()}</statement>`;
    }
} 
