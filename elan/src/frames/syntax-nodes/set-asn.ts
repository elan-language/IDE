import { CompileError } from "../compile-error";
import { Scope } from "../interfaces/scope";
import { AbstractAstNode } from "./abstract-ast-node";
import { AstIdNode } from "../interfaces/ast-id-node";
import { ExprAsn } from "./expr-asn";

export class SetAsn extends AbstractAstNode implements AstIdNode {
  constructor(
    public readonly id: string,
    private readonly to: ExprAsn,
    public readonly fieldId: string,
    scope: Scope,
  ) {
    super();
  }

  aggregateCompileErrors(): CompileError[] {
    return this.compileErrors.concat(this.to.aggregateCompileErrors());
  }

  compile(): string {
    this.compileErrors = [];
    return `${this.id} = ${this.to}`;
  }

  symbolType() {
    return this.to.symbolType();
  }

  toString() {
    return `Set (${this.id}) (${this.to})`;
  }
}
