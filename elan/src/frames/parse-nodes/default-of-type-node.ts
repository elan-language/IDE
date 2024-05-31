import { defaultKeyword } from "../keywords";
import { AbstractSequence } from "./abstract-sequence";
import { KeywordNode } from "./keyword-node";
import { Space } from "./parse-node-helpers";
import { SpaceNode } from "./space-node";
import { TypeNode } from "./type-node";

export class DefaultOfTypeNode extends AbstractSequence {
  type: TypeNode | undefined;

  parseText(text: string): void {
    this.addElement(new KeywordNode(defaultKeyword));
    this.addElement(new SpaceNode(Space.required));
    this.type = new TypeNode();
    this.addElement(this.type);
    super.parseText(text);
  }
}
