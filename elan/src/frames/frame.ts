
export interface Frame {
    renderAsHtml(): string;
    indent(): string;
    renderAsSource(): string;

    initialize(frameMap : Map<string, Frame>, parent?: Frame) : void;

    isSelected() : boolean;
    select(multiSelect?: boolean): void;
    deselect(): void;

    hasParent(): boolean;
    setParent(parent: Frame) : void;
    getParent() : Frame | undefined;
    selectParent(): void; //Cursor left

    hasChildren(): boolean;
    selectFirstChild(): boolean;

    //For methods below, if the operation is not valid in context, the current frame is returned
    selectNextPeer(): void;
    selectPreviousPeer(): void;
    selectFirstPeer(): void; //Home
    selectLastPeer(): void; //End

    selectFirstText(): boolean;

    isCollapsed() : boolean;
    collapse() : void;
    expand() : void;
}