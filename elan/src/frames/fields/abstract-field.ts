import { Selectable } from "../interfaces/selectable";
import { ParseStatus } from "../parse-status";
import { Field } from "../interfaces/field";
import { Frame } from "../interfaces/frame";
import { KeyEvent } from "../interfaces/key-event";
import {CodeSource } from "../code-source";

export abstract class AbstractField implements Selectable, Field {
    public isField: boolean = true;
    protected text: string = "";
    protected placeholder: string = "";
    protected useHtmlTags: boolean = false;
    protected htmlId: string = "";
    private selected: boolean = false;
    private focused: boolean = false;
    private _classes = new Array<string>;
    private holder: Frame;
    private _optional: boolean = false;
    protected map: Map<string, Selectable>;
    private status: ParseStatus = ParseStatus.incomplete;
    private cursorPos: number = 0; //Relative to LH end of text

    constructor(holder: Frame) {
        this.holder = holder;
        var map = holder.getMap();
        this.htmlId = `${this.getIdPrefix()}${map.size}`;
        map.set(this.htmlId, this);
        this.map = map;
        this.parseCurrentText();
    }
    
    abstract parseFunction(input: [ParseStatus, string]): [ParseStatus, string];

    parseFrom(source: CodeSource): void {
        var rol = source.readToEndOfLine();
        var result = this.parseFunction([ParseStatus.notParsed, rol]);
        if (result[0] === ParseStatus.valid || this._optional) {
            var taken = rol.length - result[1].length;
            this.text = rol.substring(0, taken);
            rol = rol.substring(taken);
            source.pushBackOntoFrontOfCode(rol);
        } else {
            throw new Error(`Parse ${result[0].toString()} at ${rol}`);
        } 
    }

    getHelp(): string {
        return "";
    }

    setOptional(optional: boolean) : void {
        this._optional = optional;
        if (this.text ==='' && optional ) {
            this.status = ParseStatus.valid;
        } else  if (this.text ==='' && !optional ) {
            this.status === ParseStatus.incomplete;
        }
    }

    getOptional(): boolean {
        return this._optional;
    }

    isOptional(): boolean {
        return this._optional;
    }

    parseCurrentText() : ParseStatus {
        var status: ParseStatus = ParseStatus.notParsed;
        if (this.text === "") {
            status = this._optional ? ParseStatus.valid : ParseStatus.incomplete;
        } else {
            var result = this.parseFunction([ParseStatus.notParsed, this.text]);
            if (result[1].length > 0) {
                status = ParseStatus.invalid;
            } else {
                status = result[0];
            }
        }
        return status;
    }

    processKey(e: KeyEvent): void {
        var key = e.key;
        if (key?.length === 1) {
            this.text = this.text.slice(0,this.cursorPos) + key + this.text.slice(this.cursorPos);
            this.cursorPos ++;
            this.parseCurrentText();
            return;
        }
        switch (key) {
          case "Tab": {
            if (e.shift) {
                this.holder.selectFieldOrFrameBefore(this);
            } else {
                this.holder.selectFieldOrFrameAfter(this);
            } 
            break;
          } 
          case "Enter": {
            this.holder.selectFieldOrFrameAfter(this);
            break;
          }
          case "ArrowRight": {
            if (this.cursorPos === this.text.length) {
                this.holder.selectFieldOrFrameAfter(this);
            } else {
                this.cursorPos ++;
            }
            break;
          } 
          case "ArrowLeft": {
            if (this.cursorPos === 0) {
                this.holder.selectFieldOrFrameBefore(this);
            } else {
                this.cursorPos --;
            }
            break;
          } 
          case "Home": {
            this.cursorPos === 0;
            break;
          } 
          case "End": {
            this.cursorPos === this.text.length;
            break;
          } 
          case "Backspace": {
            if (this.cursorPos > 0) {
                this.text = this.text.slice(0,this.cursorPos - 1) + this.text.slice(this.cursorPos);
                this.cursorPos --;
                this.parseCurrentText();
            }
            break;
          } 
          case "Escape": {
            this.holder.select(true, false);
            break;
          } 
        }
    }
    
    isFocused(): boolean {
        return this.focused;
    }
    getHolder(): Frame  {
        return this.holder;
    }
    getIdPrefix(): string {
        return 'text';
    }
    focus(): void {
        this.focused = true;
    }
    defocus(): void {
        this.focused = false;
    }

    deselectAll() {
        for (const f of this.map.values()) {
            if (f.isSelected()) {
                f.deselect();
            }
        }
    }
    getStatus(): ParseStatus {
        return this.parseCurrentText();
    }

    select(): void {
        this.deselectAll();
        this.selected = true;
        this.focus();
    }

    isSelected() : boolean {
        return this.selected === true;
    }

    deselect(): void {
        this.selected = false;
        this.defocus();
    }

    setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder;
    }

    public textAsHtml(): string {
        if (this.selected) {
            return `<input data-cursor="${this.cursorPos}" size="${this.width()}" placeholder="${this.placeholder}" value="${this.escapeDoubleQuotes(this.text)}">`;
        }
        else{ 
            var c = this.escapeAngleBrackets(this.text);
            return c;
        } 
    }

    public width(): number {
        return this.text ?  (this.text.length > 1 ? this.text.length-1 : 1): this.placeholder.length-1;
    }

    private escapeDoubleQuotes(str: string): string {
        return str
            .replace(/"/g, '&quot;');
    }

    private escapeAngleBrackets(str: string) : string {
        return str
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    public textAsSource() : string {
        return this.text;
     }

    private tagTypeNames(c: string) : string {
        return c.replaceAll(/([A-Z][A-Za-z0-9_]*)/g,'<type>$1</type>');
    } 

    private tagKeywords(c: string) : string {
        var keywords = ["new ", "of ", "with "];
        keywords.forEach(kw => {
            c = c.replaceAll(kw,`<keyword>${kw}</keyword>`);
        });
        return c;
    }

    protected setClasses() {
        this._classes = new Array<string>();
        this.pushClass(this.selected, "selected");
        this.pushClass(this.focused, "focused");
        this.pushClass(!this.text, "empty");
        this.pushClass(this.isOptional(), "optional");
        this._classes.push(ParseStatus[this.getStatus()]);
    }

    protected pushClass(flag: boolean, cls: string) {
        if (flag) {
            this._classes.push(cls);
        }
    }

    protected cls(): string {
        this.setClasses();
        return this._classes.join(" ");
    };

    renderAsHtml(): string {
        return `<field id="${this.htmlId}" class="${this.cls()}" tabindex=0><text>${this.textAsHtml()}</text><placeholder>${this.placeholder}</placeholder><help>${this.getHelp()}</help></field>`;
    }

    indent(): string {
        return "";
    }

    renderAsSource(): string {
        return this.textAsSource();
    }

    renderAsObjectCode(): string {
        return this.textAsSource();
    }

    setText(text: string) {
        this.text = text;
    }
}