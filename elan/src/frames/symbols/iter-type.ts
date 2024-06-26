import { GenericSymbolType } from "../interfaces/generic-symbol-type";
import { SymbolType } from "../interfaces/symbol-type";

export class IterType implements GenericSymbolType {
  constructor(public readonly ofType: SymbolType) {}

  initialValue = "system.emptyIter()";

  isImmutable = true;

  get name() {
    return `Iter <${this.ofType.name}>`;
  }

  toString(): string {
    return `Iter<of ${this.ofType.name}>`;
  }
}
