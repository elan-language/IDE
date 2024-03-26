import { ISymbolType } from "./ISymbolType";

export class ArrayType implements ISymbolType {

    constructor(private ofType: ISymbolType) {

    }

    get name() {
        return `Array <${this.ofType.name}>`;
    }
}