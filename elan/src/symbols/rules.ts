import { ParseStatus } from "../frames/parse-status";
import { ISymbol } from "./ISymbol";
import { ISymbolType } from "./ISymbolType";

export function compatibleType(symbol: ISymbol | undefined, symbolType: ISymbolType | undefined): ParseStatus {
    if (symbol?.symbolType?.name === symbolType?.name) {
        return ParseStatus.valid;
    }
    return ParseStatus.invalid;
}