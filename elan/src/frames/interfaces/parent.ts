import { ElanSymbol } from "./symbol";
import { AbstractSelector } from "../abstract-selector";
import { Field } from "./field";
import { Frame } from "./frame";
import { StatementFactory } from "./statement-factory";
import { File} from "./file";
import { Transforms } from "../syntax-nodes/transforms";
import { Scope } from "./scope";


export interface Parent extends Scope {
    //External use
    isParent: boolean;

    minimumNumberOfChildrenExceeded(): boolean;
    getFirstChild(): Frame; 
    getLastChild(): Frame;
    expand(): void;
    collapse(): void;
    
    getChildren(): Frame[];
    getChildAfter(child: Frame): Frame;
    getChildBefore(child: Frame): Frame;
    getChildRange(first: Frame, last: Frame): Frame[];
    removeChild(child: Frame): void;
    addChildBefore(newFrame: Frame, existingChild: Frame): void;
    addChildAfter(newFrame: Frame, existingChild: Frame): void;

    indent(): string;

    getFile(): File;

    getIdPrefix(): string;
    hasParent(): boolean;
    getParent(): Parent;

    getFields(): Field[];

    moveSelectedChildrenDownOne(): void;
    moveSelectedChildrenUpOne(): void;

    insertOrGotoChildSelector(after: boolean, child: Frame): void;
    newChildSelector(): AbstractSelector;

    getFactory(): StatementFactory;

    resolveSymbol(id: string | undefined, transforms: Transforms, initialScope : Frame): ElanSymbol;
}