import { KeyEvent } from "../interfaces/key-event";
import { StatementFactory } from "../interfaces/statement-factory";
import { FrameWithStatements } from "../frame-with-statements";
import { AbstractSelector } from "../abstract-selector";

export class StatementSelector extends AbstractSelector  {
    isStatement = true;
    private factory: StatementFactory;

    constructor(parent: FrameWithStatements) {
        super(parent);
        this.factory = (parent.getFactory());
    }

    getHelp(): string {
       return this.text === "s" ? "set switch" : this.text === "t" ? "throw try" : "call each for if print repeat set switch throw try var while #";
    }

    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0">${this.textToDisplay()}</statement>`;
    }

    processKey(keyEvent: KeyEvent): void {
        var char = keyEvent.key;
        var empty = this.text ==="";
        if (empty && (char ==='c')) {
            this.factory.addCallBefore(this);
            return;
        }
        if (empty && (char ==='e')) {
            this.factory.addEachBefore(this);
            return;
        } 
        if (empty && (char ==='f')) {
            this.factory.addForBefore(this);
            return;
        }
        if (empty && (char ==='i')) {
            this.factory.addIfThenBefore(this);
            return;
        }
        if (empty && (char ==='p')) {
            this.factory.addPrintBefore(this);
            return;
        }
        if (empty && (char ==='r')) {
            this.factory.addRepeatBefore(this);
            return;
        }
        if (empty && (char ==='s')) {
            this.text += char;
            return;
        }
        if (this.text ==="s" && (char ==='e')) {
            this.factory.addSetBefore(this);
            this.clearText();
            return;
        }
        if (this.text ==="s" && (char ==='w')) {
            this.factory.addSwitchBefore(this);
            this.clearText();
            return;
        }
        if (empty && (char ==='t')) {
            this.text += char;
            return;
        }
        if (this.text ==="t" && (char ==='h')) {
            this.factory.addThrowBefore(this);
            this.clearText();
            return;
        }
        if (this.text ==="t" && (char ==='r')) {
            this.factory.addTryBefore(this);
            this.clearText();
            return;
        }
        if (empty && (char ==='v')) {
            this.factory.addVarBefore(this);
            return;
        }
        if (empty && (char ==='w')) {
            this.factory.addWhileBefore(this);
            return;
        }
        super.processKey(keyEvent);
    }
} 
