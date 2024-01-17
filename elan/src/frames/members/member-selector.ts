import { nextId } from "../helpers";
import { PlainText } from "../text-entry-fields/plain_text";
import { Member } from "./member";

export class MemberSelector implements Member {
    htmlId: string = "";
    text: PlainText = new PlainText("member");
    private cls : string ="";

    constructor() {
        this.htmlId = `memberSelect${nextId()}`;
    }

    renderAsHtml(): string {
        return `<memberSelector class="${this.cls}" id='${this.htmlId}' tabindex="0">${this.text.renderAsHtml()}</memberSelector>`;
    }
} 
