import { ISymbolType } from "./ISymbolType";

export class CharType implements ISymbolType {
    private constructor() { }

    static Instance : ISymbolType = new CharType();

    name = "Char";
}