import { Field } from "../frames/interfaces/field";
import { ISymbol } from "./ISymbol";

export function isSymbol(s?: any): s is ISymbol {
    return !!s && 'symbolId' in s && 'symbolType' in s;
}

export function findSymbolInScope(id: string, field: Field): ISymbol | undefined {
    return undefined;
}