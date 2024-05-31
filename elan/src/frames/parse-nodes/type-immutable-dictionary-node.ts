import { AbstractSequence } from "./abstract-sequence";
import { SymbolNode } from "./symbol-node";
import { TypeNode } from "./type-node";
import { TypeSimpleNode } from "./type-simple-node";
import { CLOSE_BRACE, CLOSE_SQ_BRACKET, COLON, OPEN_BRACE, OPEN_SQ_BRACKET } from "../symbols";

export class TypeImmutableDictionaryNode extends AbstractSequence {
  simpleType: TypeSimpleNode | undefined;
  keyType: TypeNode | undefined;
  valueType: TypeNode | undefined;

  constructor() {
    super();
    this.completionWhenEmpty = "Type";
  }
  parseText(text: string): void {
    this.remainingText = text;
    if (text.length > 0) {
      this.simpleType = new TypeSimpleNode(); //Not added to elements, as not present in the text
      this.simpleType.parseText("ImmutableDictionary");
      this.addElement(new SymbolNode(OPEN_BRACE));
      this.keyType = new TypeNode();
      this.addElement(this.keyType);
      this.addElement(new SymbolNode(COLON));
      this.valueType = new TypeNode();
      this.addElement(this.valueType);
      this.addElement(new SymbolNode(CLOSE_BRACE));
      super.parseText(text);
    }
  }
}
