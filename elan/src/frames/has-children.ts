import { Frame } from "./frame";

export interface HasChildren extends Frame {
    selectFirstChild(multiSelect: boolean): boolean; //Cursor right
    selectLastChild(multiSelect: boolean): void; //Cursor right
    selectChildAfter(child: Frame, multiSelect: boolean): void;
    selectChildBefore(child: Frame, multiSelect: boolean): void;
    selectChildRange(multiSelect: boolean): void;
    isRangeSelecting() : boolean; 
}