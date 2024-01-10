"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetFrame = void 0;
const frame_factory_1 = require("./frame-factory");
const text_frame_1 = require("./text-frame");
const text_selector_frame_1 = require("./text-selector-frame");
class SetFrame {
    classes = '';
    idFrame;
    exprFrame;
    htmlId;
    constructor(identifier, expr) {
        this.idFrame = new text_frame_1.TextFrame(identifier, text_selector_frame_1.TextType.identifier);
        this.exprFrame = new text_frame_1.TextFrame(expr, text_selector_frame_1.TextType.expression);
        this.htmlId = `set${(0, frame_factory_1.nextId)()}`;
    }
    clearSelector() {
        if (this.idFrame instanceof text_selector_frame_1.TextSelectorFrame) {
            this.idFrame = new text_frame_1.TextFrame("", text_selector_frame_1.TextType.identifier);
        }
        if (this.exprFrame instanceof text_selector_frame_1.TextSelectorFrame) {
            this.exprFrame = new text_frame_1.TextFrame("", text_selector_frame_1.TextType.expression);
        }
    }
    addFrame(frame, textType) {
        if (textType === text_selector_frame_1.TextType.identifier) {
            this.idFrame = frame;
        }
        else {
            this.exprFrame = frame;
        }
    }
    userInput(key) {
        if (this.idFrame instanceof text_selector_frame_1.TextSelectorFrame) {
            this.idFrame = this.idFrame.userInput(key);
            if (this.idFrame instanceof text_frame_1.TextFrame && this.exprFrame instanceof text_frame_1.TextFrame) {
                if (this.exprFrame.value.length === 0) {
                    this.exprFrame = new text_selector_frame_1.TextSelectorFrame(text_selector_frame_1.TextType.expression);
                }
            }
        }
        if (this.exprFrame instanceof text_selector_frame_1.TextSelectorFrame) {
            this.exprFrame = this.exprFrame.userInput(key);
        }
        return this;
    }
    newFrame(id) {
        throw new Error("Method not implemented.");
    }
    select(id, cls) {
        this.classes = '';
        if (id === this.htmlId) {
            this.classes = cls;
        }
        if (this.idFrame.htmlId === id) {
            this.idFrame = new text_selector_frame_1.TextSelectorFrame(text_selector_frame_1.TextType.identifier, this.idFrame.value);
        }
        if (this.exprFrame.htmlId === id) {
            this.exprFrame = new text_selector_frame_1.TextSelectorFrame(text_selector_frame_1.TextType.expression, this.exprFrame.value);
        }
    }
    renderAsHtml() {
        const cls = `frame ${this.classes}`;
        const id = this.idFrame.renderAsHtml();
        const expr = this.exprFrame.renderAsHtml();
        return `<statement id='${this.htmlId}' class="${cls}" tabindex="0">
                <keyword>set</keyword>
                ${id}
                <keyword>to</keyword>
                ${expr}
                </statement>`;
    }
}
exports.SetFrame = SetFrame;
//# sourceMappingURL=set-frame.js.map