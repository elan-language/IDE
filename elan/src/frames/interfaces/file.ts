import { editorEvent } from "../interfaces/editor-event";
import { CodeSource } from "../code-source";
import { CompileStatus, ParseStatus } from "../status-enums";
import { Frame } from "./frame";
import { Parent } from "./parent";
import { Selectable } from "./selectable";
import { StatementFactory } from "./statement-factory";
import { TestStatus } from "../test-status";
import { RunStatus } from "../run-status";
import { CompileError } from "../compile-error";

export interface File extends Parent {
    // external use
    isFile : boolean;
    getById(id: string) : Selectable;
    renderAsHtml(): Promise<string>;
    renderAsSource(): Promise<string>;
    compile(): string;
    fileName : string;
    readonly defaultFileName: string;

    addChildBefore(g: Frame, before: Frame): void;
    addChildAfter(g: Frame, after: Frame): void;

    getMap(): Map<string, Selectable>;
    getFactory(): StatementFactory;

    indent(): string;
    expandCollapseAll(): void;

    parseStatus(): ParseStatus;
    testStatus(): TestStatus;
    runStatus(): RunStatus;

    //Internal use only
    createMain(): Frame;
    createFunction(): Frame;
    createProcedure(): Frame;
    createEnum(): Frame;
    createClass(): Frame;
    createGlobalComment(): Frame;
    createConstant(): Frame;
    createTest(): Frame;

    parseFrom(source: CodeSource): Promise<void>;

    containsMain(): boolean;

    parseError?: string;

    deselectAll(): void;
    processKey(e: editorEvent): void;

    compileErrors(): CompileError[];
    getCompileStatus(): CompileStatus

    setRunStatus(s : RunStatus) : void;
}