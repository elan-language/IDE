import { Frame } from "./frame";
import { nextId } from "./frame-factory";
import { TextType } from "./text-selector-frame";

export class TextFrame implements Frame {

    constructor(public readonly value: string, private textType: TextType) {
        this.elementId = nextId();
    }

    userInput(key: string): Frame {
        throw new Error("Method not implemented.");
    }
    
    newFrame(): void {
        throw new Error("Method not implemented.");
    }

    private elementId: number;

    public applyClass(id: string, cls: string) {
      
    }

    renderAsHtml(): string {
        return this.textType === TextType.identifier ?   `<identifier>${this.value}</identifier>` : `<expression>${this.value}</expression>`;
    }
}