import { Frame } from "./frame";
import { nextId } from "./frame-factory";
import { SetFrame } from "./set-frame";
import { TextSelectorFrame, TextType } from "./text-selector-frame";
import { VarFrame } from "./var-frame";

export class StatementSelectorFrame implements Frame {

    private classes = '';

    public htmlId = "";

    constructor() {
        this.elementId = nextId();
    }
    clearSelector(): void {
        throw new Error("Method not implemented.");
    }

    private matckkeyword(key: string) {
        if (this.index !== 0){
            return;
        }

        switch (key) {
            case "v" : {
                this.kw = "var";
                break;
            }
            case "s" : {
                this.kw = "set";
                break;
            }
        }
    }

    private createFrame(f : TextSelectorFrame) {
        switch (this.kw) {
            case "var" : {
                const vf = new VarFrame("", "");
                vf.addFrame(f, TextType.identifier);
                return vf;
            }
            case "set" : {
                const sf = new SetFrame("", "");
                sf.addFrame(f, TextType.identifier);
                return sf;
            }
            default: {
                console.warn("unexpeced keyword: " + this.kw);
                return this;
            }
        }

    }

    private kw = "";
    private index = 0;

    userInput(key: string): Frame {
        this.matckkeyword(key);

        if (key === this.kw[this.index]) {
            this.index++;
        }
        
        if ((key === "Backspace" && this.index > 0)) {
           this.index--;
        }

        if ((key === "Tab" && this.index > 0) || (this.index === this.kw.length)) {
            return this.createFrame(new TextSelectorFrame(TextType.identifier))!;
        }

        return this;
    }

    newFrame(id? : string): void {
        throw new Error("Method not implemented.");
    }

    private elementId: number;

    public select(id: string, cls: string) {
      
    }

    renderAsHtml(): string {
        if (this.index === 0) {
            return `<statement id='${this.kw}${this.elementId}' class="frame">
                    <input id="ss" class="live" type="text">
                    </statement>`;
        }
        else {
            return `<statement id='${this.kw}${this.elementId}' class="frame">
                    <span class='keyword'>${this.kw.substring(0, this.index)}</span><input id="ss" class="live" type="text" placeholder="${this.kw.substring(this.index)}">
                    </statement>`;
        }
    }
}