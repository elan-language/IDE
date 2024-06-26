import { andKeyword, isKeyword, notKeyword, orKeyword } from "../keywords";
import { AbstractAlternatives } from "./abstract-alternatives";
import { KeywordNode } from "./keyword-node";
import { Sequence } from "./sequence";
import { PLUS, MINUS, MULT, DIVIDE, GT, LT, GE, LE, POWER } from "../symbols";
import { OperatorNode } from "./operator-node";
import { SpaceNode } from "./space-node";
import { Space } from "./parse-node-helpers";

export class BinaryOperation extends AbstractAlternatives {
  constructor() {
    super();
    this.completionWhenEmpty = "operator ";
  }
  parseText(text: string): void {
    this.alternatives.push(new OperatorNode(PLUS));
    this.alternatives.push(new OperatorNode(MINUS));
    this.alternatives.push(new OperatorNode(MULT));
    this.alternatives.push(new OperatorNode(DIVIDE));
    this.alternatives.push(new OperatorNode(GT));
    this.alternatives.push(new OperatorNode(LT));
    this.alternatives.push(new OperatorNode(GE));
    this.alternatives.push(new OperatorNode(LE));
    this.alternatives.push(new OperatorNode(POWER));
    this.alternatives.push(new KeywordNode(isKeyword));
    const is = () => new KeywordNode(isKeyword);
    const sp = () => new SpaceNode(Space.required);
    const not = () => new KeywordNode(notKeyword);
    this.alternatives.push(new Sequence([is, sp, not]));
    this.alternatives.push(new KeywordNode(andKeyword));
    this.alternatives.push(new KeywordNode(orKeyword));
    super.parseText(text.trimStart());
  }

  compile(): string {
    const code = super.compile();

    return code;
  }
}
