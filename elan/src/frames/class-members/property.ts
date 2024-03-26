import { AbstractFrame } from "../abstract-frame";
import { CodeSource } from "../code-source";
import { Identifier } from "../fields/identifier";
import { Type } from "../fields/type";
import { Class } from "../globals/class";
import { Field } from "../interfaces/field";
import { Member } from "../interfaces/member";
import { asKeyword, privateKeyword, propertyKeyword } from "../keywords";

export class Property extends AbstractFrame implements Member {
    isMember = true;
    name: Identifier;
    type: Type;
    public private: boolean = false;
    private class: Class;

    constructor(parent: Class) {
        super(parent);
        this.class = parent as Class;
        this.name = new Identifier(this);
        this.type = new Type(this);
    }

    getFields(): Field[] {
        return [this.name, this.type];
    }

    getIdPrefix(): string {
        return 'prop';
    }
    private modifierAsHtml(): string {
        return this.private ? `<keyword>private </keyword>` : "";
    }
    private modifierAsSource(): string {
        return this.private ? `private ` : "";
    }

    private modifierAsObjectCode(): string {
        return this.private ? `private ` : "";
    }

    renderAsHtml(): string {
        return `<property class="${this.cls()}" id='${this.htmlId}' tabindex="0">${this.modifierAsHtml()}<keyword>${propertyKeyword} </keyword>${this.name.renderAsHtml()}<keyword> ${asKeyword} </keyword>${this.type.renderAsHtml()}</property>`;
    }

    renderAsSource(): string {
        return `${this.indent()}${this.modifierAsSource()}${propertyKeyword} ${this.name.renderAsSource()} ${asKeyword} ${this.type.renderAsSource()}\r\n`;
    }

    renderAsObjectCode(): string {
        return `${this.indent()}${this.modifierAsObjectCode()}${this.name.renderAsObjectCode()};\r\n`;
    }

    parseFrom(source: CodeSource): void {
        var priv = `${privateKeyword} `;
        if (source.isMatch(priv)) {
            source.remove(priv);
            this.private = true;
        }
        source.remove(`${propertyKeyword} `);
        this.name.parseFrom(source);
        source.remove(` ${asKeyword} `);
        this.type.parseFrom(source);
    }
} 
