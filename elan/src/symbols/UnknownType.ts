import { ISymbolType } from "./ISymbolType";

export class UnknownType implements ISymbolType {
    private constructor() { }

    static Instance : ISymbolType = new UnknownType();

    name = "Unknown";
}