import { AstCollectionNode } from "../interfaces/ast-collection-node";
import { AstIdNode } from "../interfaces/ast-id-node";
import { AstNode } from "../interfaces/ast-node";
import { AstQualifierNode } from "../interfaces/ast-qualifier-node";
import { Scope } from "../interfaces/scope";
import { globalKeyword, libraryKeyword, propertyKeyword, thisKeyword } from "../keywords";
import { AbstractAlternatives } from "../parse-nodes/abstract-alternatives";
import { ArrayListNode } from "../parse-nodes/array-list-node";
import { AssignableNode } from "../parse-nodes/assignable-node";
import { BinaryExpression } from "../parse-nodes/binary-expression";
import { BracketedExpression } from "../parse-nodes/bracketed-expression";
import { CommaNode } from "../parse-nodes/comma-node";
import { CopyWith } from "../parse-nodes/copy-with";
import { CSV } from "../parse-nodes/csv";
import { DeconstructedList } from "../parse-nodes/deconstructed-list";
import { DeconstructedTuple } from "../parse-nodes/deconstructed-tuple";
import { DictionaryNode } from "../parse-nodes/dictionary-node";
import { EmptyOfTypeNode } from "../parse-nodes/empty-of-type-node";
import { EnumVal } from "../parse-nodes/enum-val";
import { FuncTypeNode } from "../parse-nodes/func-type-node";
import { FunctionCallNode } from "../parse-nodes/function-call-node";
import { IdentifierNode } from "../parse-nodes/identifier-node";
import { IfExpr } from "../parse-nodes/if-expr";
import { ImmutableDictionaryNode } from "../parse-nodes/immutable-dictionary-node";
import { ImmutableListNode } from "../parse-nodes/immutable-list-node";
import { IndexDouble } from "../parse-nodes/index-double";
import { IndexSingle } from "../parse-nodes/index-single";
import { InstanceNode } from "../parse-nodes/instanceNode";
import { InstanceProcRef } from "../parse-nodes/instanceProcRef";
import { KeywordNode } from "../parse-nodes/keyword-node";
import { KVPnode } from "../parse-nodes/kvp-node";
import { Lambda } from "../parse-nodes/lambda";
import { LitBoolean } from "../parse-nodes/lit-boolean";
import { LitFloat } from "../parse-nodes/lit-float";
import { LitInt } from "../parse-nodes/lit-int";
import { LitStringEmpty } from "../parse-nodes/lit-string-empty";
import { LitStringNonEmpty } from "../parse-nodes/lit-string-non-empty";
import { LitTuple } from "../parse-nodes/lit-tuple";
import { Multiple } from "../parse-nodes/multiple";
import { NewInstance } from "../parse-nodes/new-instance";
import { OptionalNode } from "../parse-nodes/optional-node";
import { ParamDefNode } from "../parse-nodes/param-def-node";
import { ParseNode } from "../parse-nodes/parse-node";
import { Qualifier } from "../parse-nodes/qualifier";
import { RangeNode } from "../parse-nodes/range-node";
import { RegExMatchNode } from "../parse-nodes/regex-match-node";
import { Sequence } from "../parse-nodes/sequence";
import { SetClause } from "../parse-nodes/set-clause";
import { SpaceNode } from "../parse-nodes/space-node";
import { StringInterpolation } from "../parse-nodes/string-interpolation";
import { SymbolNode } from "../parse-nodes/symbol-node";
import { TupleNode } from "../parse-nodes/tuple-node";
import { TypeDictionaryNode } from "../parse-nodes/type-dictionary-node";
import { TypeGenericNode } from "../parse-nodes/type-generic-node";
import { TypeImmutableDictionaryNode } from "../parse-nodes/type-immutable-dictionary-node";
import { TypeImmutableListNode } from "../parse-nodes/type-immutable-list-node";
import { TypeListNode } from "../parse-nodes/type-list-node";
import { TypeSimpleNode } from "../parse-nodes/type-simple-node";
import { TypeTupleNode } from "../parse-nodes/type-tuple-node";
import { UnaryExpression } from "../parse-nodes/unary-expression";
import { VarRefCompound } from "../parse-nodes/var-ref-compound";
import { VarRefNode } from "../parse-nodes/var-ref-node";
import { WithClause } from "../parse-nodes/with-clause";
import { SetStatement } from "../statements/set-statement";
import { EnumType } from "../symbols/enum-type";
import { wrapScopeInScope } from "../symbols/symbol-helpers";
import { isAstIdNode, isAstQualifierNode } from "./ast-helpers";
import { BinaryExprAsn } from "./binary-expr-asn";
import { BracketedAsn } from "./bracketed-asn";
import { CsvAsn } from "./csv-asn";
import { DeconstructedListAsn } from "./deconstructed-list-asn";
import { DeconstructedTupleAsn } from "./deconstructed-tuple-asn";
import { EmptyAsn } from "./empty-asn";
import { EmptyTypeAsn } from "./empty-type-asn";
import { ExprAsn } from "./expr-asn";
import { FixedIdAsn } from "./fixed-id-asn";
import { FuncCallAsn } from "./func-call-asn";
import { IdAsn } from "./id-asn";
import { IdDefAsn } from "./id-def-asn";
import { IfExprAsn } from "./if-expr-asn";
import { IndexAsn } from "./index-asn";
import { InterpolatedAsn } from "./interpolated-asn";
import { KvpAsn } from "./kvp-asn";
import { LambdaAsn } from "./lambda-asn";
import { LambdaSigAsn } from "./lambda-sig-asn";
import { LiteralArrayListAsn } from "./literal-array-list-asn";
import { LiteralBoolAsn } from "./literal-bool-asn";
import { LiteralDictionaryAsn } from "./literal-dictionary-asn";
import { LiteralEnumAsn } from "./literal-enum-asn";
import { LiteralFloatAsn } from "./literal-float-asn";
import { LiteralImmutableDictionaryAsn } from "./literal-immutable-dictionary-asn";
import { LiteralImmutableListAsn } from "./literal-immutable-list-asn";
import { LiteralIntAsn } from "./literal-int-asn";
import { LiteralStringAsn } from "./literal-string-asn";
import { LiteralTupleAsn } from "./literal-tuple-asn";
import { NewAsn } from "./new-asn";
import { OperationSymbol } from "./operation-symbol";
import { ParamDefAsn } from "./param-def-asn";
import { QualifierAsn } from "./qualifier-asn";
import { RangeAsn } from "./range-asn";
import { SegmentedStringAsn } from "./segmented-string-asn";
import { SetAsn } from "./set-asn";
import { ThisAsn } from "./this-asn";
import { TypeAsn } from "./type-asn";
import { UnaryExprAsn } from "./unary-expr-asn";
import { VarAsn } from "./var-asn";
import { WithAsn } from "./with-asn";

function mapOperation(op: string) {
  switch (op.trim()) {
    case "+":
      return OperationSymbol.Add;
    case "-":
      return OperationSymbol.Minus;
    case "*":
      return OperationSymbol.Multiply;
    case "<":
      return OperationSymbol.LT;
    case ">":
      return OperationSymbol.GT;
    case ">=":
      return OperationSymbol.GTE;
    case "<=":
      return OperationSymbol.LTE;
    case "and":
      return OperationSymbol.And;
    case "or":
      return OperationSymbol.Or;
    case "xor":
      return OperationSymbol.Xor;
    case "not":
      return OperationSymbol.Not;
    case "is":
      return OperationSymbol.Equals;
    case "isnt":
      return OperationSymbol.NotEquals;
    case "div":
      return OperationSymbol.Div;
    case "mod":
      return OperationSymbol.Mod;
    case "/":
      return OperationSymbol.Divide;
    case "^":
      return OperationSymbol.Pow;
    default:
      throw new Error("Not implemented");
  }
}

export function asCsv(nodes: AstNode[], id: string, scope: Scope) {
  return new CsvAsn(nodes, id, scope);
}

export function transformMany(
  node: CSV | Multiple | Sequence,
  fieldId: string,
  scope: Scope,
): AstCollectionNode {
  const asts = new Array<AstNode>();

  for (const elem of node.getElements()) {
    if (elem instanceof Multiple || elem instanceof CSV || elem instanceof Sequence) {
      const asns = transformMany(elem, fieldId, scope).items;

      for (const asn of asns) {
        if (asn) {
          asts.push(asn);
        }
      }
    } else {
      const asn = transform(elem, fieldId, scope);
      if (asn) {
        asts.push(asn);
      }
    }
  }

  return new CsvAsn(asts, fieldId, scope);
}

export function transform(
  node: ParseNode | undefined,
  fieldId: string,
  scope: Scope,
): AstNode | undefined {
  if (node instanceof BracketedExpression) {
    return new BracketedAsn(transform(node.expr, fieldId, scope)!, fieldId, scope);
  }

  if (node instanceof UnaryExpression) {
    const op = mapOperation(node.unaryOp!.matchedText);
    const operand = transform(node.term, fieldId, scope) as ExprAsn;

    return new UnaryExprAsn(op, operand, fieldId, scope);
  }

  if (node instanceof BinaryExpression) {
    const lhs = transform(node.lhs, fieldId, scope) as ExprAsn;
    const rhs = transform(node.rhs, fieldId, scope) as ExprAsn;
    const op = mapOperation(node.op!.matchedText);

    return new BinaryExprAsn(op, lhs, rhs, fieldId, scope);
  }

  if (node instanceof LitInt) {
    return new LiteralIntAsn(node.matchedText, fieldId);
  }

  if (node instanceof LitBoolean) {
    return new LiteralBoolAsn(node.matchedText, fieldId);
  }

  if (node instanceof LitFloat) {
    return new LiteralFloatAsn(node.matchedText, fieldId);
  }

  if (node instanceof LitStringEmpty) {
    return new LiteralStringAsn(node.matchedText, fieldId);
  }

  if (node instanceof LitStringNonEmpty) {
    const ss = node.segments ? transformMany(node.segments, fieldId, scope).items : [];

    if (ss.map((i) => i instanceof InterpolatedAsn).reduce((i, s) => i || s)) {
      return new SegmentedStringAsn(ss, fieldId, scope);
    }

    return new LiteralStringAsn(node.matchedText, fieldId);
  }

  if (node instanceof IdentifierNode) {
    // kludge - fix
    if (
      (fieldId.startsWith("var") ||
        fieldId.startsWith("ident") ||
        fieldId.startsWith("enumVals")) &&
      !(scope instanceof SetStatement) // to catch range value
    ) {
      return new IdDefAsn(node.matchedText, fieldId, scope);
    }

    return new IdAsn(node.matchedText, fieldId, scope);
  }

  if (node instanceof FunctionCallNode) {
    const qualifier = transform(node.qualifier, fieldId, scope);
    const id = node.name!.matchedText;
    const parameters = transformMany(node.args as CSV, fieldId, scope).items as Array<ExprAsn>;

    return new FuncCallAsn(id, qualifier, parameters, fieldId, scope);
  }

  if (node instanceof Lambda) {
    const parameters = transformMany(node.params as CSV, fieldId, scope)
      .items as Array<ParamDefAsn>;
    const sig = new LambdaSigAsn(parameters, fieldId, scope);
    // wrap sig scope in another scope to prevent looking up a symbol in current scope.
    const body = transform(node.expr, fieldId, wrapScopeInScope(sig)) as ExprAsn;

    return new LambdaAsn(sig, body, fieldId, scope);
  }

  if (node instanceof ParamDefNode) {
    const id = node.name?.matchedText ?? "";
    const type = transform(node.type, fieldId, scope);

    if (isAstIdNode(type)) {
      return new ParamDefAsn(id, type, fieldId, scope);
    }

    return undefined;
  }

  if (node instanceof TypeGenericNode) {
    const type = node.simpleType!.matchedText;
    const generic = node.generic;
    let gp = new Array<AstNode>();
    gp = transformMany(generic as Sequence, fieldId, scope).items;
    return new TypeAsn(type, gp, fieldId, scope);
  }

  if (node instanceof TypeListNode || node instanceof TypeImmutableListNode) {
    const type = node.simpleType!.matchedText;
    const gp = transform(node.generic, fieldId, scope)!;
    return new TypeAsn(type, [gp], fieldId, scope);
  }

  if (node instanceof TypeDictionaryNode || node instanceof TypeImmutableDictionaryNode) {
    const type = node.simpleType!.matchedText;
    const key = transform(node.keyType, fieldId, scope)!;
    const value = transform(node.valueType, fieldId, scope)!;
    return new TypeAsn(type, [key, value], fieldId, scope);
  }

  if (node instanceof FuncTypeNode) {
    const type = "Func";
    const inp = node.inputTypes ? transformMany(node.inputTypes, fieldId, scope).items : [];
    const oup = node.returnType ? [transform(node.returnType, fieldId, scope)!] : [];

    return new TypeAsn(type, inp.concat(oup), fieldId, scope);
  }

  if (node instanceof TypeSimpleNode) {
    const type = node.matchedText;

    return new TypeAsn(type, [], fieldId, scope);
  }

  if (node instanceof EmptyOfTypeNode) {
    const type = transform(node.type, fieldId, scope) as TypeAsn;
    return new EmptyTypeAsn(type, fieldId, scope);
  }

  if (node instanceof OptionalNode) {
    if (node.matchedNode) {
      return transform(node.matchedNode, fieldId, scope);
    }
    return undefined;
  }

  if (node instanceof VarRefNode) {
    return transform(node.bestMatch, fieldId, scope);
  }

  if (node instanceof SetClause) {
    const id = node.property!.matchedText;
    const to = transform(node.expr, fieldId, scope) as ExprAsn;

    return new SetAsn(id, to, fieldId, scope);
  }

  if (node instanceof SymbolNode) {
    return undefined;
  }

  if (node instanceof CommaNode) {
    return undefined;
  }

  if (node instanceof SpaceNode) {
    return undefined;
  }

  if (node instanceof KeywordNode) {
    // todo decouple this from js
    if (node.fixedText === globalKeyword) {
      return new FixedIdAsn(globalKeyword, fieldId);
    }
    if (node.fixedText === libraryKeyword) {
      return new FixedIdAsn(libraryKeyword, fieldId);
    }
    if (node.fixedText === propertyKeyword || node.fixedText === thisKeyword) {
      return new ThisAsn(node.fixedText, fieldId, scope);
    }

    return undefined;
  }

  if (node instanceof AbstractAlternatives) {
    if (node.bestMatch) {
      return transform(node.bestMatch, fieldId, scope);
    }
    return new EmptyAsn(fieldId);
  }

  if (node instanceof ImmutableListNode) {
    const items = transformMany(node.csv as CSV, fieldId, scope).items;
    return new LiteralImmutableListAsn(items, fieldId, scope);
  }

  if (node instanceof ArrayListNode) {
    const items = transformMany(node.csv as CSV, fieldId, scope).items;
    return new LiteralArrayListAsn(items, fieldId, scope);
  }

  if (node instanceof DictionaryNode) {
    const items = transformMany(node.csv!, fieldId, scope);
    return new LiteralDictionaryAsn(items, fieldId, scope);
  }

  if (node instanceof ImmutableDictionaryNode) {
    const items = transformMany(node.csv!, fieldId, scope);
    return new LiteralImmutableDictionaryAsn(items, fieldId, scope);
  }

  if (node instanceof TupleNode) {
    const items = transformMany(node.csv as CSV, fieldId, scope).items;
    return new LiteralTupleAsn(items, fieldId, scope);
  }

  if (node instanceof LitTuple) {
    const items = transformMany(node.csv as CSV, fieldId, scope).items;
    return new LiteralTupleAsn(items, fieldId, scope);
  }

  if (node instanceof DeconstructedTuple) {
    const items = transformMany(node.csv as CSV, fieldId, scope).items.filter((i) =>
      isAstIdNode(i),
    );
    return new DeconstructedTupleAsn(items, fieldId, scope);
  }

  if (node instanceof DeconstructedList) {
    const hd = node.head!.matchedText;
    const tl = node.tail!.matchedText;
    return new DeconstructedListAsn(hd, tl, fieldId, scope);
  }

  if (node instanceof WithClause) {
    return transform(node.changes, fieldId, scope);
  }

  if (node instanceof NewInstance) {
    const type = transform(node.type, fieldId, scope) as TypeAsn;
    const pp = transformMany(node.args as CSV, fieldId, scope).items;
    return new NewAsn(type, pp, fieldId, scope);
  }

  if (node instanceof VarRefCompound) {
    const q = transform(node.optQualifier, fieldId, scope) as AstQualifierNode | undefined;
    const id = node.simple!.matchedText;
    const index = transform(node.index, fieldId, scope) as IndexAsn | undefined;
    return new VarAsn(id, false, q, index, fieldId, scope);
  }

  if (node instanceof CopyWith) {
    const obj = transform(node.original, fieldId, scope) as ExprAsn;
    const changes = transform(node.changes, fieldId, scope) as CSV | undefined;
    return new WithAsn(obj, changes, fieldId, scope);
  }

  if (node instanceof TypeTupleNode) {
    const gp = transformMany(node.types as CSV, fieldId, scope).items;
    return new TypeAsn("Tuple", gp, fieldId, scope);
  }

  if (node instanceof RangeNode) {
    const fromNode = node.fromIndex?.matchedNode;
    const from = fromNode ? transform(fromNode, fieldId, scope) : undefined;
    const toNode = node.toIndex?.matchedNode;
    const to = toNode ? transform(toNode, fieldId, scope) : undefined;
    return new RangeAsn(from, to, fieldId, scope);
  }

  if (node instanceof IndexDouble) {
    const indexOne = transform(node.indexOne, fieldId, scope) as ExprAsn;
    const indexTwo = transform(node.indexTwo, fieldId, scope) as ExprAsn;

    return new IndexAsn(indexOne, indexTwo, fieldId, scope);
  }

  if (node instanceof IndexSingle) {
    const index = transform(node.contents, fieldId, scope) as ExprAsn;
    return new IndexAsn(index, undefined, fieldId, scope);
  }

  if (node instanceof Qualifier) {
    const q = transform(node.qualifier, fieldId, scope)!;
    return new QualifierAsn(q, fieldId, scope);
  }

  if (node instanceof InstanceNode) {
    const id = node.variable!.matchedText;
    const index = transform(node.index, fieldId, scope) as IndexAsn | undefined;
    return new VarAsn(id, false, undefined, index, fieldId, scope);
  }

  if (node instanceof IfExpr) {
    const condition = transform(node.condition, fieldId, scope) as ExprAsn;
    const tr = transform(node.whenTrue, fieldId, scope) as ExprAsn;
    const fl = transform(node.whenFalse, fieldId, scope) as ExprAsn;
    return new IfExprAsn(condition, tr, fl, fieldId, scope);
  }

  if (node instanceof EnumVal) {
    const id = node.val!.matchedText;
    const type = new EnumType(node.type!.matchedText);

    return new LiteralEnumAsn(id, type, fieldId, scope);
  }

  if (node instanceof KVPnode) {
    const key = transform(node.key, fieldId, scope)!;
    const value = transform(node.value, fieldId, scope)!;

    return new KvpAsn(key, value, fieldId, scope);
  }

  if (node instanceof StringInterpolation) {
    const value = transform(node.expr, fieldId, scope)!;

    return new InterpolatedAsn(value, fieldId, scope);
  }

  if (node instanceof RegExMatchNode) {
    return new LiteralStringAsn(node.matchedText, fieldId);
  }

  if (node instanceof AssignableNode) {
    let q: AstQualifierNode | undefined;
    let id: string = "";

    const sp = node.simpleOrProp;

    if (sp.bestMatch instanceof IdentifierNode) {
      const idNode = transform(sp.bestMatch, fieldId, scope);
      if (isAstIdNode(idNode)) {
        id = idNode.id;
      }
    } else if (sp.bestMatch instanceof Sequence) {
      const [i0, i1] = transformMany(sp.bestMatch, fieldId, scope).items;
      if (isAstQualifierNode(i0)) {
        q = i0;
      }
      if (isAstIdNode(i1)) {
        id = i1.id;
      }
    }

    const index = transform(node.index, fieldId, scope) as IndexAsn | undefined;
    return new VarAsn(id, true, q, index, fieldId, scope);
  }

  if (node instanceof InstanceProcRef) {
    const q = transform(node.qualifier, fieldId, scope) as AstQualifierNode | undefined;
    const id = node.simple!.matchedText;
    return new VarAsn(id, false, q, undefined, fieldId, scope);
  }

  throw new Error("Not implemented " + (node ? node.constructor.name : "undefined"));
}
