import { ISymbolType } from "./ISymbolType";

export class BooleanType implements ISymbolType {
    private constructor() { }

    static Instance : ISymbolType = new BooleanType();

    name = "Boolean";
}