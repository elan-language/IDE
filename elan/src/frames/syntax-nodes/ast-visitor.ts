import { AbstractAlternatives } from "../parse-nodes/abstract-alternatives";
import { BinaryExpression } from "../parse-nodes/binary-expression";
import { LitInt } from "../parse-nodes/lit-int";
import { ParseNode } from "../parse-nodes/parse-node";
import { OperationSymbol } from "./operation-symbol";
import { AstNode } from "./ast-node";
import { BinaryExprAsn } from "./binary-expr-asn";
import { ExprAsn } from "./expr-asn";
import { LiteralIntAsn } from "./literal-int-asn";
import { UnaryExpression } from "../parse-nodes/unary-expression";
import { UnaryExprAsn } from "./unary-expr-asn";
import { LitBool } from "../parse-nodes/lit-bool";
import { LiteralBoolAsn } from "./literal-bool-asn";
import { IdentifierNode } from "../parse-nodes/identifier-node";
import { IdAsn } from "./id-asn";
import { FunctionCallNode } from "../parse-nodes/function-call-node";
import { FuncCallAsn } from "./func-call-asn";
import { CSV } from "../parse-nodes/csv";
import { OptionalNode } from "../parse-nodes/optional-node";
import { Multiple } from "../parse-nodes/multiple";
import { LitFloat } from "../parse-nodes/lit-float";
import { LiteralFloatAsn } from "./literal-float-asn";
import { Sequence } from "../parse-nodes/sequence";
import { Lambda } from "../parse-nodes/lambda";
import { LambdaAsn } from "./lambda-asn";
import { ParamDefNode } from "../parse-nodes/param-def-node";
import { ParamDefAsn } from "./param-def-asn";
import { TypeWithOptGenerics } from "../parse-nodes/type-with-opt-generics";
import { TypeAsn } from "./type-asn";
import { SymbolNode } from "../parse-nodes/symbol-node";
import { KeywordNode } from "../parse-nodes/keyword-node";
import { DefaultOfTypeNode } from "../parse-nodes/default-of-type-node";
import { DefaultTypeAsn } from "./default-type-asn";
import { WithClause } from "../parse-nodes/with-clause";
import { WithAsn } from "./with-asn";
import { ListNode } from "../parse-nodes/list-node";
import { SetAsn } from "./set-asn";
import { VarRefNode } from "../parse-nodes/var-ref-node";
import { VarAsn } from "./var-asn";
import { SetClause } from "../parse-nodes/set-clause";
import { LitChar } from "../parse-nodes/lit-char";
import { LiteralCharAsn } from "./literal-char-asn";
import { BracketedExpression } from "../parse-nodes/bracketed-expression";
import { BracketedAsn } from "./bracketed-asn";
import { LitString } from "../parse-nodes/lit-string";
import { LiteralStringAsn } from "./literal-string-asn";
import { globalKeyword, libraryKeyword, propertyKeyword } from "../keywords";
import { IndexNode } from "../parse-nodes/index-node";
import { IndexAsn } from "./index-asn";
import { LiteralListAsn } from "./literal-list-asn";
import { NewInstance } from "../parse-nodes/new-instance";
import { NewAsn } from "./new-asn";
import { TypeSimpleNode } from "../parse-nodes/type-simple-node";
import { TupleNode } from "../parse-nodes/tuple-node";
import { LiteralTupleAsn } from "./literal-tuple-asn";
import { CommaNode } from "../parse-nodes/comma-node";
import { SpaceNode } from "../parse-nodes/space-node";
import { Scope } from "../interfaces/scope";
import { LambdaSigAsn } from "./lambda-sig-asn";
import { IfExpr } from "../parse-nodes/if-expr";
import { IfExprAsn } from "./if-expr-asn";
import { EnumVal } from "../parse-nodes/enum-val";
import { LiteralEnumAsn } from "./literal-enum-asn";
import { EnumType } from "../../symbols/enum-type";
import { Dictionary } from "../parse-nodes/dictionary";
import { LitTuple } from "../parse-nodes/lit-tuple";
import { DeconstructedTuple } from "../parse-nodes/deconstructed-tuple";
import { ResultAsn } from "./result-asn";
import { RangeAsn } from "./range-asn";
import { DeconstructedList } from "../parse-nodes/deconstructed-list";
import { DeconstructedListAsn } from "./deconstructed-list-asn";
import { LiteralDictionaryAsn } from "./literal-dictionary-asn";
import { KVPnode } from "../parse-nodes/kvp-node";
import { KvpAsn } from "./kvp-asn";
import { VarRefCompound } from "../parse-nodes/var-ref-compound";
import { TermWith } from "../parse-nodes/term-with";
import { TypeTuple } from "../parse-nodes/type-tuple";
import { RangeNode } from "../parse-nodes/range-node";
import { Qualifier } from "../parse-nodes/qualifier";
import { InstanceNode } from "../parse-nodes/instanceNode";
import { LitStringEmpty } from "../parse-nodes/lit-string-empty";
import { LitStringNonEmpty } from "../parse-nodes/lit-string-non-empty";
import { StringInterpolation } from "../parse-nodes/string-interpolation";
import { InterpolatedAsn } from "./interpolated-asn";
import { RegExMatchNode } from "../parse-nodes/regex-match-node";
import { SegmentedStringAsn } from "./segmented-string-asn";
import { FuncTypeNode } from "../parse-nodes/func-type-node";
import { QualifierAsn } from "./qualifier-asn";
import { FixedIdAsn } from "./fixed-id-asn";
import { AssignableNode } from "../parse-nodes/assignable-node";
import { InstanceProcRef } from "../parse-nodes/instanceProcRef";
import { CSV_Element } from "../parse-nodes/csv-element";

function mapOperation(op: string) {
    switch (op.trim()) {
        case "+": return OperationSymbol.Add;
        case "-": return OperationSymbol.Minus;
        case "*": return OperationSymbol.Multiply;
        case "<": return OperationSymbol.LT;
        case ">": return OperationSymbol.GT;
        case ">=": return OperationSymbol.GTE;
        case "<=": return OperationSymbol.LTE;
        case "and": return OperationSymbol.And;
        case "or": return OperationSymbol.Or;
        case "xor": return OperationSymbol.Xor;
        case "not": return OperationSymbol.Not;
        case "is": return OperationSymbol.Equals;
        case "is not": return OperationSymbol.NotEquals;
        case "div": return OperationSymbol.Div;
        case "mod": return OperationSymbol.Mod;
        case "/": return OperationSymbol.Divide;
        case "^": return OperationSymbol.Pow;
        default: throw new Error("Not implemented");
    }
}

export function transformMany(node: CSV | Multiple | Sequence, scope : Scope): Array<AstNode> {
    const ast = new Array<AstNode>();

    for (const elem of node.getElements()) {
        if (elem instanceof Multiple || elem instanceof CSV || elem instanceof Sequence) {
            const asns = transformMany(elem, scope);

            for (const asn of asns) {
                if (asn) {
                    ast.push(asn);
                }
            }
        }
        else {
            const asn = transform(elem, scope);
            if (asn) {
                ast.push(asn);
            }
        }
    }

    return ast;
}


export function transform(node: ParseNode | undefined, scope : Scope): AstNode | undefined {

    if (node instanceof BracketedExpression) {
        return new BracketedAsn(transform(node.expr, scope)!, scope);
    }

    if (node instanceof UnaryExpression) {
        const op = mapOperation(node.unaryOp!.matchedText);
        const operand = transform(node.term, scope) as ExprAsn;

        return new UnaryExprAsn(op, operand, scope);
    }

    if (node instanceof BinaryExpression) {
        const lhs = transform(node.lhs, scope) as ExprAsn;
        const rhs = transform(node.rhs, scope) as ExprAsn;
        const op = mapOperation(node.op!.matchedText);

        return new BinaryExprAsn(op, lhs, rhs, scope);
    }

    if (node instanceof LitInt) {
        return new LiteralIntAsn(node.matchedText);
    }

    if (node instanceof LitBool) {
        return new LiteralBoolAsn(node.matchedText);
    }

    if (node instanceof LitFloat) {
        return new LiteralFloatAsn(node.matchedText);
    }

    if (node instanceof LitChar) {
        return new LiteralCharAsn(node.matchedText);
    }

    if (node instanceof LitStringEmpty) {
        return new LiteralStringAsn(node.matchedText);
    }

    if (node instanceof LitStringNonEmpty) {
        const ss = node.segments ? transformMany(node.segments, scope) : [];

        if (ss.map(i => i instanceof InterpolatedAsn).reduce((i, s) => i || s)){
            return new SegmentedStringAsn(ss, scope);
        }

        return new LiteralStringAsn(node.matchedText);
    }

    if (node instanceof IdentifierNode) {
        return new IdAsn(node.matchedText, scope);
    }

    if (node instanceof FunctionCallNode) {
        const qualifier = transform(node.qualifier, scope);
        const id = node.name!.matchedText;
        const parameters = transformMany(node.args as CSV, scope) as Array<ExprAsn>;

        return new FuncCallAsn(id, qualifier, parameters, scope);
    }

    if (node instanceof Lambda) {
        const parameters = transformMany(node.params as CSV, scope) as Array<ParamDefAsn>;
        const sig = new LambdaSigAsn(parameters, scope);
        const body = transform(node.expr, sig) as ExprAsn;

        return new LambdaAsn(sig, body, scope);
    }

    if (node instanceof ParamDefNode) {
        const id = node.name!.matchedText;
        const type = transform(node.type, scope)!;

        return new ParamDefAsn(id, type, scope);
    }

    if (node instanceof TypeWithOptGenerics) {
        const type = node.simpleType!.matchedText;
        const opt = (node.generic as OptionalNode).matchedNode;
        var gp = new Array<AstNode>();

        if (opt) {
            gp = transformMany(opt as Sequence, scope)!;
        }

        return new TypeAsn(type, gp, scope);
    }

    if (node instanceof FuncTypeNode) {
        const type = "Func";
        var inp = node.inputTypes ? transformMany(node.inputTypes, scope) : [];
        var oup = node.returnType ? [transform(node.returnType, scope)!] : [];
        
        return new TypeAsn(type, inp.concat(oup), scope);
    }

    if (node instanceof TypeSimpleNode) {
        const type = node.matchedText;

        return new TypeAsn(type, [], scope);
    }

    if (node instanceof DefaultOfTypeNode) {
        const type = transform(node.type, scope) as TypeAsn;
        return new DefaultTypeAsn(type, scope);
    }

    if (node instanceof OptionalNode) {
        if (node.matchedNode) {
            return transform(node.matchedNode, scope);
        }
        return undefined;
    }

    if (node instanceof VarRefNode) {
        return transform(node.bestMatch, scope);
    }

    if (node instanceof SetClause) {
        const id = node.property!.matchedText;
        const to = transform(node.expr, scope) as ExprAsn;

        return new SetAsn(id, to, scope);
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
        // if (node.fixedText === globalKeyword) {
        //     return new IdAsn(node.fixedText, scope);
        // }
        if (node.fixedText === libraryKeyword) {
            return new FixedIdAsn("_stdlib");
        }
        if (node.fixedText === propertyKeyword) {
            return new FixedIdAsn("this");
        }

        return undefined;
    }

    if (node instanceof IndexNode) {
        const index = transform(node.contents, scope) as ExprAsn;
        return new IndexAsn(index, scope);
    }

    if (node instanceof AbstractAlternatives) {
        return transform(node.bestMatch, scope);
    }

    if (node instanceof ListNode) {
        const items = transformMany(node.csv as CSV, scope);
        return new LiteralListAsn(items, scope);
    }

    if (node instanceof Dictionary) {
        const items = transform(node.kvps, scope) as LiteralListAsn;
        return new LiteralDictionaryAsn(items, scope);
    }

    if (node instanceof TupleNode) {
        const items = transformMany(node.csv as CSV, scope);
        return new LiteralTupleAsn(items, scope);
    }

    if (node instanceof LitTuple) {
        const items = transformMany(node.csv as CSV, scope);
        return new LiteralTupleAsn(items, scope);
    }

    if (node instanceof DeconstructedTuple) {
        const items = transformMany(node.csv as CSV, scope);
        return new LiteralTupleAsn(items, scope);
    }

    if (node instanceof DeconstructedList) {
        const hd = node.head!.matchedText;
        const tl = node.tail!.matchedText;
        return new DeconstructedListAsn(hd, tl, scope);
    }

    if (node instanceof WithClause) {
        return transform(node.changes, scope);
    }

    if (node instanceof NewInstance) {
        const type = transform(node.type, scope) as TypeAsn;
        const pp = transformMany(node.args as CSV, scope);
        return new NewAsn(type, pp, scope);
    }

    if (node instanceof VarRefCompound) {
        const q = transform(node.optQualifier, scope);
        const id = node.simple!.matchedText;
        const index = transform(node.index, scope);
        return new VarAsn(id, q, index, scope);
    }

    if (node instanceof TermWith ) {
        const obj = transform(node.term, scope) as ExprAsn;
        const changes = transform(node.with, scope) as LiteralListAsn;
        return new WithAsn(obj, changes, scope);
    }

    if (node instanceof TypeTuple) {
        const gp = transformMany(node.types as CSV, scope);
        return new TypeAsn("Tuple", gp, scope);
    }

    if (node instanceof RangeNode) {
        var fromNode = node.fromIndex?.matchedNode;
        const from = fromNode ? transform(fromNode, scope) : undefined;
        var toNode = node.toIndex?.matchedNode;
        const to = toNode ? transform(toNode, scope) : undefined;
        return new RangeAsn(from, to, scope);
    }
    if (node instanceof Qualifier) {
        return transform(node.qualifier, scope);
    }
    if (node instanceof InstanceNode) {
        var id = node.variable!.matchedText;
        var index = transform(node.index, scope);
        return new VarAsn(id, undefined, index, scope);
    }

    if (node instanceof IfExpr) {
       const condition = transform(node.condition, scope) as ExprAsn;
       const tr = transform(node.whenTrue, scope) as ExprAsn;
       const fl = transform(node.whenFalse, scope) as ExprAsn;
       return new IfExprAsn(condition, tr, fl, scope);
    }

    if (node instanceof EnumVal) {
        var id = node.val!.matchedText;
        var type = new EnumType(node.type!.matchedText);
 
        return new LiteralEnumAsn(id, type, scope);
     }

     if (node instanceof KVPnode) {
        var key = transform(node.key, scope)!;
        var value = transform(node.value, scope)!;
 
        return new KvpAsn(key, value, scope);
     }

     if (node instanceof StringInterpolation) {
        var value = transform(node.expr, scope)!;
 
        return new InterpolatedAsn(value, scope);
     }

     if (node instanceof RegExMatchNode) {
        return new LiteralStringAsn(node.matchedText);
     }

    if (node instanceof AssignableNode) {
        const q = transform(node.qualifier, scope);
        const id = node.simple.matchedText;
        const index = transform(node.index, scope);
        return new VarAsn(id, q, index, scope);
    }

    if (node instanceof InstanceProcRef) {
        const q = transform(node.qualifier, scope);
        const id = node.simple!.matchedText;
        return new VarAsn(id, q, undefined, scope);
    }

    if (node instanceof CSV_Element) {
        return transform(node.contents, scope);
    }

    throw new Error("Not implemented " + typeof node);
}