import { AbstractAlternatives } from "./abstract-alternatives";
import { LitValueNode } from "./lit-value";
import { UnaryExpression } from "./unary-expression";
import { BracketedExpression } from "./bracketed-expression";
import { NewInstance } from "./new-instance";
import { TupleNode as TupleNode } from "./tuple-node";
import { Lambda } from "./lambda";
import { IfExpr } from "./if-expr";
import { ImmutableListNode } from "./immutable-list-node";
import { ExprNode } from "./expr-node";
import { VarRefNode } from "./var-ref-node";
import { FunctionCallNode } from "./function-call-node";
import { LiteralNode } from "./literal-node";
import { KeywordNode } from "./keyword-node";
import { thisKeyword } from "../keywords";
import { ArrayListNode } from "./array-list-node";
import { EmptyOfTypeNode } from "./empty-of-type-node";

export class Term extends AbstractAlternatives {
  constructor() {
    super();
    this.completionWhenEmpty = "expression";
  }

  parseText(text: string): void {
    //Sub nodes added only when asked to parse
    this.alternatives.push(new BracketedExpression());
    this.alternatives.push(new Lambda());
    this.alternatives.push(new IfExpr());
    this.alternatives.push(new NewInstance());
    this.alternatives.push(new UnaryExpression());
    this.alternatives.push(new LiteralNode()); // Literal must be before Var to detect true/false
    this.alternatives.push(new KeywordNode(thisKeyword));
    this.alternatives.push(new VarRefNode());
    this.alternatives.push(new FunctionCallNode());
    this.alternatives.push(new EmptyOfTypeNode());
    this.alternatives.push(new ImmutableListNode(() => new ExprNode()));
    this.alternatives.push(new ArrayListNode(() => new ExprNode()));
    this.alternatives.push(new TupleNode());
    super.parseText(text);
  }
}
