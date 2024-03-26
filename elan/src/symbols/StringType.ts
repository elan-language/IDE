import { ISymbolType } from "./ISymbolType";

export class StringType implements ISymbolType {
    private constructor() { }

    static Instance : ISymbolType = new StringType();

    name = "String";
}