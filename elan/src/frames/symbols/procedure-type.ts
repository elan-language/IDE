import { SymbolType } from "../interfaces/symbol-type";

export class ProcedureType implements SymbolType {
  constructor(
    public readonly parametersTypes: SymbolType[],
    public readonly isExtension: boolean,
    public readonly isAsync: boolean,
  ) {}

  isImmutable = true;

  initialValue = "";

  get name() {
    return `Procedure (${this.parametersTypes.map((p) => p.name).join(", ")})`;
  }

  toString(): string {
    return `Procedure`;
  }
}
