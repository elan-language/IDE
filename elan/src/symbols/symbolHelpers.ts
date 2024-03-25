import { FrameWithStatements } from "../frames/frame-with-statements";
import { isFrame } from "../frames/helpers";
import { Field } from "../frames/interfaces/field";
import { Frame } from "../frames/interfaces/frame";
import { ISymbol } from "./ISymbol";

export function isSymbol(s?: any): s is ISymbol {
    return !!s && 'symbolId' in s && 'symbolType' in s;
}

export function findSymbolInScope(id: string, field: Field): ISymbol | undefined {
    var holder = field.getHolder();
    if (isFrame(holder)) {
        return findSymbolInFrameScope(id, holder);
    }
    return undefined;
}

export function findSymbolInFrameScope(id: string, frame: Frame): ISymbol | undefined {
    var parentOfHolder = frame.getParent();

    if (parentOfHolder instanceof FrameWithStatements) {
        var fst = parentOfHolder.getFirstChild();
        var range = parentOfHolder.getChildRange(fst, frame as Frame);
        if (range.length > 1) {
            range = range.slice(0, range.length - 1);

            for (var f of range) {
                if (isSymbol(f)) {
                    if (f.symbolId === id) {
                        return f;
                    }
                }
            }
        }
    }

    return undefined;
}