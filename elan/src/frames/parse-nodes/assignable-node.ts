import { propertyKeyword } from "../keywords";
import { AbstractSequence } from "./abstract-sequence";
import { Alternatives } from "./alternatives";
import { IdentifierNode } from "./identifier-node";
import { IndexNode } from "./index-node";
import { KeywordNode } from "./keyword-node";
import { OptionalNode } from "./optional-node";
import { Qualifier } from "./qualifier";
import { Sequence } from "./sequence";

export class AssignableNode extends AbstractSequence {
  simpleOrProp: Alternatives;
  index: OptionalNode;

  constructor() {
    super();
    const propDot = () => new Qualifier(new KeywordNode(propertyKeyword));
    const simple = () => new IdentifierNode();
    const qualProp = () => new Sequence([propDot, simple]);
    this.simpleOrProp = new Alternatives([simple, qualProp]);
    this.addElement(this.simpleOrProp);
    this.index = new OptionalNode(new IndexNode());
    this.addElement(this.index);
  }
}
