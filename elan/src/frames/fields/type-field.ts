import { UnknownType } from "../symbols/unknown-type";
import { CodeSource } from "../code-source";
import { Frame } from "../interfaces/frame";
import { ParseNode } from "../parse-nodes/parse-node";
import { TypeNode } from "../parse-nodes/type-node";
import { Transforms } from "../syntax-nodes/transforms";
import { AbstractField } from "./abstract-field";
import { isAstType } from "../helpers";

export class TypeField extends AbstractField {
  isParseByNodes = true;
  constructor(holder: Frame) {
    super(holder);
    this.useHtmlTags = true;
    this.placeholder = "Type";
    this.help = `A simple Type name must begin with an upper-case letter. More complex types are: 'generic type', 'tuple type', 'function type' - consult documentation for these.`;
  }
  getIdPrefix(): string {
    return "type";
  }
  initialiseRoot(): ParseNode {
    this.astNode = undefined;
    this.rootNode = new TypeNode();
    return this.rootNode;
  }
  readToDelimiter: (source: CodeSource) => string = (source: CodeSource) =>
    source.readToEndOfLine();

  compile(transforms: Transforms): string {
    this.compileErrors = [];
    const astNode = this.getOrTransformAstNode(transforms);
    if (isAstType(astNode)) {
      return astNode.compileToEmptyObjectCode();
    }
    return super.compile(transforms);
  }

  symbolType(transforms?: Transforms) {
    return this.getOrTransformAstNode(transforms).symbolType();
  }
}
