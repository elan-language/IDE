import { FrameWithStatements } from "../frames/frame-with-statements";
import { Field } from "../frames/interfaces/field";
import { Frame } from "../frames/interfaces/frame";
import { ISymbol } from "./ISymbol";

export function isSymbol(s?: any): s is ISymbol {
    return !!s && 'symbolId' in s && 'symbolType' in s;
}

export function findSymbolInScope(id: string, field: Field): ISymbol | undefined {
    var holder = field.getHolder();
    var parentOfHolder = holder.getParent();

    if (parentOfHolder instanceof FrameWithStatements) {
        var fst = parentOfHolder.getFirstChild();
        var range = parentOfHolder.getChildRange(fst, holder as Frame);
        if (range.length > 1) {
            range = range.slice(0, range.length - 1);

            for (var f of range) {
                if (isSymbol(f)) {
                    return f;
                }
            }
        }
    }

    return undefined;
}