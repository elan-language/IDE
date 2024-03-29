import { isFrame } from './frames/helpers';
import { Collapsible } from './frames/interfaces/collapsible';
import { editorEvent } from './frames/interfaces/editor-event';
import { File } from './frames/interfaces/file';
import { Frame } from './frames/interfaces/frame';
import { Selectable } from './frames/interfaces/selectable';

function getAllSelected(file: File) {
    const v = file?.getMap().values()!;
    return [...v].filter(s => s.isSelected());
}
export function handleClick(e: editorEvent, file: File) {
    switch (e.target) {
        case 'frame': {
            const s = file.getById(e.id!);

            if (e.modKey.shift && isFrame(s)) {
                const parent = s.getParent();
                // all current selections with same parent
                const curSel = getAllSelected(file).filter(i => isFrame(i) && i.getParent() === parent);

                if (curSel.length > 0) {
                    const toSelect = new Set<Selectable>();

                    for (var cs of curSel) {
                        const range = parent.getChildRange(cs as Frame, s);
                        for (var r of range) {
                            toSelect.add(r);
                        }
                    }

                    // this should clear all other selections
                    s?.select(true, false);
                    // select all in range
                    for (var ts of toSelect) {
                        ts.select(false, true);
                    }
                    // select with focus clicked on frame
                    s?.select(true, true);
                }
                else {
                    s?.select(true, false);
                }
            }
            else {
                s?.select(true, false);
            }
            break;
        }
    }
}
export function handleDblClick(e: editorEvent, file: File) {
    switch (e.target) {
        case 'frame': {
            const s = file.getById(e.id!) as Collapsible;
            s.expandCollapse();
            break;
        }
    }
}

export function handleKey(e: editorEvent, file: File) {
    switch (e.key) {
        case 'Shift': break;  //Short circuit repeat from modifier held-down before other key
        case 'Control': break;
        case 'Alt': break; 
        default: {
            if (e.target === "frame") {
                file.getById(e.id!).processKey(e);
            } else {
                file.processKey(e);
            }
        }				
    }
}
