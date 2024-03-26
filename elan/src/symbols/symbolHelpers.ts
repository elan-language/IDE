import { FrameWithStatements } from "../frames/frame-with-statements";
import { isFrame } from "../frames/helpers";
import { Field } from "../frames/interfaces/field";
import { Frame } from "../frames/interfaces/frame";
import { BooleanType } from "./BooleanType";
import { FloatType } from "./FloatType";
import { IHasSymbolType } from "./IHasSymbolType";
import { IHasSymbolTypes } from "./IHasSymbolTypes";
import { ISymbol } from "./ISymbol";
import { IntType } from "./IntType";
import { UnknownType } from "./UnknownType";

export function isSymbol(s?: any): s is ISymbol {
    return !!s && 'symbolId' in s && 'symbolType' in s;
}

export function isHasSymbolType(s?: any): s is IHasSymbolType {
    return !!s && 'symbolType' in s;
}

export function isHasSymbolTypes(s?: any): s is IHasSymbolTypes {
    return !!s && 'symbolTypes' in s;
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

export function rawSymbolToType(s: string) {
    switch (s) {
        case ">":
        case "<":
        case "<=":
        case ">=":
        case "is":
        case "is not":
        case "and":
        case "or":
        case "xor":
            return BooleanType.Instance;
        case "div":
        case "mod":
            return IntType.Instance;
        case "/":
            return FloatType.Instance;
        default:
            return UnknownType.Instance;
    }
}