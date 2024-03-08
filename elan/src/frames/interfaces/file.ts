import { editorEvent } from "../interfaces/editor-event";
import { CodeSource } from "../code-source";
import { ParseStatus } from "../parse-status";
import { Frame } from "./frame";
import { Parent } from "./parent";
import { Selectable } from "./selectable";
import { StatementFactory } from "./statement-factory";

// Defines view of File from the internal (model) perspective, c.f. FileAPI for external (editor) view
export interface File extends Parent {
    // external use
    isFile : boolean;
    getById(id: string) : Selectable;
    renderAsHtml(): string;
    renderAsSource(): string;

    addChildBefore(g: Frame, before: Frame): void;
    addChildAfter(g: Frame, after: Frame): void;

    getMap(): Map<string, Selectable>;
    getFactory(): StatementFactory;

    indent(): string;
    expandCollapseAll(): void;

    status(): ParseStatus;

    //Internal use only
    addMainBefore(global: Frame): Frame;
    addFunctionBefore(global: Frame): Frame;
    addProcedureBefore(global: Frame): Frame;
    addEnumBefore(global: Frame): Frame;
    addClassBefore(global: Frame): Frame;
    addGlobalCommentBefore(global: Frame): Frame;
    addConstantBefore(global: Frame): Frame;
    addTestBefore(global: Frame): Frame;
    parseFrom(source: CodeSource): void;
    containsMain(): boolean;

    parseError?: string;

    deselectAll(): void;

    insertSelector(after: boolean, existing: Frame): void;
    processKey(e: editorEvent): void;
}