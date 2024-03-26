import { ISymbolType } from "./ISymbolType";

export class ClassType implements ISymbolType {

    constructor(private className: string) {

    }

    get name() {
        return `Class ${this.className}`;
    }
}