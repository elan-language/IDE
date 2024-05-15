import { Parent } from "../interfaces/parent";
import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";
import { ValueRefField } from "../fields/value-ref-field";
import { AbstractFrame } from "../abstract-frame";
import { Statement } from "../interfaces/statement";
import { AssertActualField } from "../fields/assert-actual-field";
import { assertKeyword } from "../keywords";
import { Transforms } from "../syntax-nodes/transforms";
import { TestStatus } from "../test-status";
import { AssertOutcome } from "../../system";
import { CompileStatus, OverallStatus } from "../status-enums";
import { helper_compileMsgAsHtml } from "../helpers";

export class AssertStatement extends AbstractFrame implements Statement{
    isStatement = true;
    actual: AssertActualField;
    expected: ValueRefField;
    outcome?: AssertOutcome;

    constructor(parent: Parent) {
        super(parent);
        this.actual = new AssertActualField(this);
        this.expected = new ValueRefField(this, /\r|\n/);
        this.expected.setPlaceholder("expected value");
    }

    initialKeywords(): string {
        return assertKeyword;
    }
    
    parseFrom(source: CodeSource): void {
        source.removeIndent();
        source.remove("assert ");
        this.actual.parseFrom(source);
        source.remove(" is ");
        this.expected.parseFrom(source);
        source.removeNewLine();
    }
    getFields(): Field[] {
        return [this.actual, this.expected];
    }

    getIdPrefix(): string {
        return 'assert';
    }

    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0"><keyword>assert </keyword>${this.actual.renderAsHtml()}<keyword> is </keyword>${this.expected.renderAsHtml()}${this.compileOrTestMsgAsHtml()}</statement>`;
    }
   
    renderAsSource(): string {
        return `${this.indent()}assert ${this.actual.renderAsSource()} is ${this.expected.renderAsSource()}`;
    }

    compile(transforms: Transforms): string {
        this.compileErrors = [];
        const expected = this.expected.compile(transforms);
        const actual = this.actual.compile(transforms);
        return `${this.indent()}_outcomes.push(system.assert(${actual}, ${expected}, "${this.htmlId}"));`;
    }

    setOutcome(outcome: AssertOutcome) {
        this.outcome = outcome;
    }

    getTestStatus(): TestStatus {
        return this.outcome? this.outcome.status : TestStatus.pending;
    }

    compileOrTestMsgAsHtml(): string {
        var msg = "";
        if (this.getCompileStatus() === CompileStatus.ok) {
            msg = this.testMsgAsHtml();
        } else {
            msg = helper_compileMsgAsHtml(this);
        }
        return msg;
    }

    testMsgAsHtml(): string {
        var cls = "";
        var msg = "";
        if (!this.outcome) {
            cls = OverallStatus[OverallStatus.warning];
            msg = `not run`;
        } else if (this.outcome.status === TestStatus.fail) {
            cls = OverallStatus[OverallStatus.error];
            msg = `actual: ${this.outcome!.actual}`;
        } else if (this.outcome.status === TestStatus.pass) {
            cls = OverallStatus[OverallStatus.ok];
            msg = `pass`;
        }
        return ` <msg class="${cls}">${msg}</msg>`;
    }
} 
