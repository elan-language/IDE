import { ISymbolType } from "./ISymbolType";

export class FloatType implements ISymbolType {
    private constructor() { }

    static Instance : ISymbolType = new FloatType();
    name = "Float";
}