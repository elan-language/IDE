import { Field } from "./field";
import { Selectable } from "./selectable";
import { ParseStatus } from "../parse-status";
import { Parent } from "./parent";

export interface Frame extends Selectable {
    isFrame: boolean;
    
    getParent(): Parent;
    getMap(): Map<string, Selectable>;

    renderAsHtml(): string;
    renderAsSource(): string;
    renderAsObjectCode(): string;

    indent(): string;

    getFields(): Field[];
    worstStatusOfFields(): ParseStatus;

    frameStatus() : ParseStatus;

    selectFirstField() : boolean;
    selectLastField() : boolean;
    selectFieldBefore(current: Field): void;
    selectFieldAfter(current: Field): void;

    //If none, return this
    getNextFrameInTabOrder(): Frame;
    getPreviousFrameInTabOrder(): Frame;

    canInsertBefore(): boolean;
    canInsertAfter(): boolean;

    fieldUpdated(field: Field): void;
}