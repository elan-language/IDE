import { UnknownType } from "../symbols/unknown-type";
import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AbstractAstNode } from "./abstract-ast-node";
import { AstNode } from "../interfaces/ast-node";

export class RangeAsn extends AbstractAstNode implements AstNode {
  constructor(
    private readonly from: AstNode | undefined,
    private readonly to: AstNode | undefined,
    public readonly fieldId: string,
    scope: Scope,
  ) {
    super();
  }

  aggregateCompileErrors(): CompileError[] {
    const fr = this.from ? this.from.aggregateCompileErrors() : [];
    const to = this.to ? this.to.aggregateCompileErrors() : [];

    return this.compileErrors.concat(fr).concat(to);
  }

  compile(): string {
    this.compileErrors = [];
    const f = this.from ? `${this.from.compile()}` : "0";
    const t = this.to ? `${this.to.compile()}` : undefined;

    if (t) {
      return `.slice(${f}, ${t})`;
    }
    return `.slice(${f})`;
  }

  symbolType() {
    return UnknownType.Instance;
  }

  toString() {
    const f = this.from ? `${this.from}` : "";
    const t = this.to ? `${this.to}` : "";
    return `Range ${f}..${t}`;
  }
}
