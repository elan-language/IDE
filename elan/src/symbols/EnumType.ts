import { ISymbolType } from "./ISymbolType";

export class EnumType implements ISymbolType {

    constructor(private enumName: string) {

    }

    get name() {
        return `Enum ${this.enumName}`;
    }
}