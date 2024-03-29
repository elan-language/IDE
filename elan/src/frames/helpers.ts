import { Member } from "./interfaces/member";
import { Field } from "./interfaces/field";
import { Collapsible } from "./interfaces/collapsible";
import { Parent } from "./interfaces/parent";
import { Frame } from "./interfaces/frame";
import { File } from "./interfaces/file";
import { MainFrame } from "./globals/main-frame";
import { AbstractSelector } from "./abstract-selector";
import { Selectable } from "./interfaces/selectable";
import { Default } from "./statements/default";

export function isCollapsible(f?: any): f is Collapsible {
    return !!f && 'isCollapsible' in f;
}

export function isFile(f?: any): f is File {
    return !!f && 'isFile' in f;
}
export function isMain(f?: any): f is MainFrame {
    return !!f && 'isMain' in f;
}

export function isFrame(f?: any): f is Frame {
    return !!f && 'isFrame' in f;
}

export function isParent(f?: any): f is Parent {
    return !!f && 'isParent' in f;
}

export function isMember(f?: any): f is Member {
    return !!f && 'isMember' in f;
} 

export function isField(f?: any): f is Field {
    return !!f && 'isField' in f;
} 

export function isSelector(f?: any): f is AbstractSelector {
    return !!f && 'isSelector' in f;
} 

export function singleIndent() {
    return "  ";
}

export function expandCollapseAll(map: Map<string, Selectable>) {
    for (const f of map.values()) {
        if (isCollapsible(f)) {
           f.expandCollapse();
        }
    }
}
export function escapeAngleBrackets(str: string) : string {
    return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
