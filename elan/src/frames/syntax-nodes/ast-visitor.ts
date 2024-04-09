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
import { List } from "../parse-nodes/list";
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
import { RuleNames } from "../parse-nodes/rule-names";
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

    for (const elem of node.elements) {
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
        return new BracketedAsn(transform(node.elements[1], scope)!, scope);
    }

    if (node instanceof UnaryExpression) {
        const op = mapOperation(node.elements[0].matchedText);
        const operand = transform(node.elements[1], scope) as ExprAsn;

        return new UnaryExprAsn(op, operand, scope);
    }

    if (node instanceof BinaryExpression) {
        const lhs = transform(node.elements[0], scope) as ExprAsn;
        const rhs = transform(node.elements[4], scope) as ExprAsn;
        const op = mapOperation(node.elements[2].matchedText);

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

    if (node instanceof LitString) {
        return new LiteralStringAsn(node.matchedText);
    }

    if (node instanceof IdentifierNode) {
        return new IdAsn(node.matchedText, scope);
    }

    if (node instanceof FunctionCallNode) {
        const qualifier = transform(node.elements[0], scope);
        const id = node.elements[1].matchedText;
        const parameters = transformMany(node.elements[3] as CSV, scope) as Array<ExprAsn>;

        return new FuncCallAsn(id, qualifier, parameters, scope);
    }

    if (node instanceof Lambda) {
        const parameters = transformMany(node.elements[1] as CSV, scope) as Array<ParamDefAsn>;
        const sig = new LambdaSigAsn(parameters, scope);
        const body = transform(node.elements[3], sig) as ExprAsn;

        return new LambdaAsn(sig, body, scope);
    }

    if (node instanceof ParamDefNode) {
        const id = node.elements[0].matchedText;
        const type = transform(node.elements[4], scope)!;

        return new ParamDefAsn(id, type, scope);
    }

    if (node instanceof TypeWithOptGenerics) {
        const type = node.elements[0].matchedText;
        const opt = (node.elements[1] as OptionalNode).matchedNode;
        var gp = new Array<AstNode>();

        if (opt) {
            gp = transformMany(opt as Sequence, scope)!;
        }

        return new TypeAsn(type, gp, scope);
    }

    if (node instanceof TypeSimpleNode) {
        const type = node.matchedText;

        return new TypeAsn(type, [], scope);
    }

    if (node instanceof DefaultOfTypeNode) {
        const type = transform(node.elements[2], scope)!;
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
        const id = node.elements[0].matchedText;
        const to = transform(node.elements[6], scope) as ExprAsn;

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
        if (node.fixedText === globalKeyword || node.fixedText === libraryKeyword || node.fixedText === propertyKeyword) {
            return new IdAsn(node.fixedText, scope);
        }

        if (node.fixedText === "result") {
            return new ResultAsn(scope);
        }

        return undefined;
    }

    if (node instanceof IndexNode) {
        const index = transform(node.elements[1], scope) as ExprAsn;
        return new IndexAsn(index, scope);
    }


    if (node instanceof AbstractAlternatives) {
        return transform(node.bestMatch, scope);
    }

    if (node instanceof List) {
        const items = transformMany(node.elements[1] as CSV, scope);
        return new LiteralListAsn(items, scope);
    }

    if (node instanceof Dictionary) {
        //const items = transformMany(node.elements[1] as CSV, scope);
        //return new LiteralListAsn(items, scope);
        return undefined;
    }

    if (node instanceof TupleNode) {
        const items = transformMany(node.elements[1] as CSV, scope);
        return new LiteralTupleAsn(items, scope);
    }

    if (node instanceof LitTuple) {
        const items = transformMany(node.elements[1] as CSV, scope);
        return new LiteralTupleAsn(items, scope);
    }

    if (node instanceof DeconstructedTuple) {
        const items = transformMany(node.elements[1] as CSV, scope);
        return new LiteralTupleAsn(items, scope);
    }

    if (node instanceof DeconstructedList) {
        const hd = node.elements[1].matchedText;
        const tl = node.elements[3].matchedText;
        return new DeconstructedListAsn(hd, tl, scope);
    }

    if (node instanceof WithClause) {
        return transform(node.elements[3], scope);
    }

    if (node instanceof NewInstance) {
        const type = transform(node.elements[2], scope)!;
        const pp = transformMany(node.elements[4] as CSV, scope);

        return new NewAsn(type, pp, scope);
    }

    if (node instanceof Sequence) {
        if (node.ruleName === RuleNames.with) {
            const obj = transform(node.elements[0], scope) as ExprAsn;
            const changes = transform(node.elements[1], scope) as LiteralListAsn;

            return new WithAsn(obj, changes, scope);
        }

        if (node.ruleName === RuleNames.qualDot) {
            return transform(node.elements[0], scope);
        }

        if (node.ruleName === RuleNames.instance) {
            var id = node.elements[0].matchedText;
            var index = transform(node.elements[1], scope);

            return new VarAsn(id, undefined, index, scope);
        }

        if (node.ruleName === RuleNames.compound) {
            const q = transform(node.elements[0], scope);
            const id = node.elements[1].matchedText;
            const index = transform(node.elements[2], scope);

            return new VarAsn(id, q, index, scope);
        }

        if (node.ruleName === RuleNames.tuple) {
            const gp = transformMany(node.elements[1] as CSV, scope);
            return new TypeAsn("Tuple", gp, scope);
        }

        if (node.ruleName === RuleNames.rangeTo) {
            const to = transform(node.elements[1], scope);
            return new RangeAsn(undefined, to, scope);
        }

        if (node.ruleName === RuleNames.rangeFrom) {
            const from = transform(node.elements[0], scope);
            return new RangeAsn(from, undefined, scope);
        }

        if (node.ruleName === RuleNames.rangeBetween) {
            const to = transform(node.elements[2], scope);
            const from = transform(node.elements[0], scope);
            return new RangeAsn(from, to, scope);
        }
    }

    if (node instanceof Multiple) {
        if (node.ruleName === RuleNames.indexes) {
            return node.elements.length > 0 ? transform(node.elements[0], scope) : undefined;
        }
    }

    if (node instanceof IfExpr) {
       const condition = transform(node.elements[1], scope) as ExprAsn;
       const e1 = transform(node.elements[3], scope) as ExprAsn;
       const e2 = transform(node.elements[5], scope) as ExprAsn;

       return new IfExprAsn(condition, e1, e2, scope);
    }

    if (node instanceof EnumVal) {
        var id = node.elements[2].matchedText;
        var type = new EnumType(node.elements[0].matchedText);
 
        return new LiteralEnumAsn(id, type, scope);
     }

    throw new Error("Not implemented " + typeof node);
}