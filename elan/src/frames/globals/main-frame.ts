import { Frame } from "../frame";
import { Global } from "./global";
import { nextId } from "../helpers";
import { Statement } from "../statements/statement";
import { StatementSelector } from "../statements/statement-selector";


export class MainFrame implements Global {

    private statements: Array<Statement> = new Array<Statement>();
    public htmlId : string ="";
    private cls() : string {
        return "";
    };
   
    constructor() {
        this.htmlId = `main${nextId()}`;
        this.addStatement(new StatementSelector());
    }

    public renderAsHtml() : string {
        const ss: Array<string> = [];
        for (var frame of this.statements) {
            ss.push(frame.renderAsHtml());
        }
        const statements = ss.join("\n");
        return `<main class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<keyword>main</keyword>
${statements}
<keyword>end main</keyword>
</main>`;
    }

    public addStatement(s : Statement) {
        this.statements.push(s);
    }

    public removeStatementSelector(): void {
        this.statements.splice(0,1);
    }
}