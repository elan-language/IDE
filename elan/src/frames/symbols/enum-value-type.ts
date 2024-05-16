import { SymbolType } from "../interfaces/symbol-type";

export class EnumValueType implements SymbolType {
  constructor(
    public readonly owner: string,
    public readonly name: string,
  ) {}

  toString() {
    return `EnumValue ${this.owner}.${this.name}`;
  }
}
