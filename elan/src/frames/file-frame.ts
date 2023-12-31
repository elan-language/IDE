import { Frame } from "./frame";
import { frameFactory } from "./frame-factory";
import { GlobalSelectorFrame } from "./global-selector-frame";

export class FileFrame implements Frame {

    private frames: Array<Frame> = new Array<Frame>();

    // to do hash 

    constructor(code: string) {
        var nl = code.indexOf("\n");
        var restOfCode = code.substring(nl + 1);

        while (restOfCode.length > 0) {
            const [f, c] = frameFactory(restOfCode);

            this.frames.push(f);
            restOfCode = c;
        }
    }

    userInput(key: string): Frame {
        var lastFrame = this.frames[this.frames.length -1];
        if (lastFrame instanceof GlobalSelectorFrame){
            const nf = lastFrame.userInput(key);
            this.frames.pop();
            this.frames.push(nf);
            return this;
        }
        lastFrame.userInput(key);
        return this;
    }

    newFrame(): void {
        var pf = new GlobalSelectorFrame();
        this.frames.push(pf);
    }

    public applyClass(id: string, cls: string) {
        for (var frame of this.frames) {
            frame.applyClass(id, cls);
        }
    }
  

    public renderAsHtml() {
        const ss: Array<string> = [];

        for (var frame of this.frames) {
            ss.push(frame.renderAsHtml());
        }

        const body = ss.join("\n");

        return `<div class='header'># Elan v0.1</div>
        ${body}`;
    }
}