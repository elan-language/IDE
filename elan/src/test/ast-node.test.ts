import { ExprNode } from '../frames/parse-nodes/expr-node';
import { testAST, stubField, boolType, charType, floatType, intType, stringType } from './testHelpers';
import { LitBool } from '../frames/parse-nodes/lit-bool';
import { LitChar } from '../frames/parse-nodes/lit-char';
import { LitInt } from '../frames/parse-nodes/lit-int';
import { LitFloat } from '../frames/parse-nodes/lit-float';
import { UnaryExpression } from '../frames/parse-nodes/unary-expression';
import { BracketedExpression } from '../frames/parse-nodes/bracketed-expression';
import { LitString } from '../frames/parse-nodes/lit-string';
import { List } from '../frames/parse-nodes/list';
import { IdentifierNode } from '../frames/parse-nodes/identifier-node';
import { FunctionCallNode } from '../frames/parse-nodes/function-call-node';
import { TypeNode } from '../frames/parse-nodes/type-node';
import { TypeWithOptGenerics } from '../frames/parse-nodes/type-with-opt-generics';
import { TypeSimpleNode } from '../frames/parse-nodes/type-simple-node';
import { TupleNode } from '../frames/parse-nodes/tuple-node';
import { Lambda } from '../frames/parse-nodes/lambda';
import { IfExpr } from '../frames/parse-nodes/if-expr';
import { ParamDefNode } from '../frames/parse-nodes/param-def-node';
import { Term } from '../frames/parse-nodes/term';
import { ListType } from '../symbols/list-type';
import { LiteralNode } from '../frames/parse-nodes/literal-node';
import { LitTuple } from '../frames/parse-nodes/lit-tuple';
import { VarRefNode } from '../frames/parse-nodes/var-ref-node';
import { DeconstructedTuple } from '../frames/parse-nodes/deconstructed-tuple';
import { ClassType } from '../symbols/class-type';
import { GenericClassType } from '../symbols/generic-class-type';
import { TupleType } from '../symbols/tuple-type';
import { NewInstance } from '../frames/parse-nodes/new-instance';
import { EnumType } from '../symbols/enum-type';
import { Dictionary } from '../frames/parse-nodes/dictionary';
import { LitValueNode } from '../frames/parse-nodes/lit-value';
import { ignore_test } from './compiler/compiler-test-helpers';

suite('ASTNodes', () => {

	test("ExprNode", () => {
		testAST(new ExprNode(), stubField, "1 + 2", "Add (1) (2)", intType);
		testAST(new ExprNode(), stubField, "a", "a", intType);
		testAST(new ExprNode(), stubField, "a + b", "Add (a) (b)", intType);
		testAST(new ExprNode(), stubField, "a + b-c", "Add (a) (Minus (b) (c))", intType);

		testAST(new ExprNode(), stubField, "3 * 4 + x", "Multiply (3) (Add (4) (x))", intType);
		testAST(new ExprNode(), stubField, "3*foo(5)", "Multiply (3) (Func Call foo (5))", intType);
		testAST(new ExprNode(), stubField, "points.foo(0.0)", "Func Call points.foo (0)", intType);
		const ast = "Func Call reduce (0, Lambda (Param s : Type String, Param p : Type List<Type String>) => (Add (s) (Multiply (Func Call p.first ()) (Func Call p.first ()))))";
		testAST(new ExprNode(), stubField, "reduce(0.0, lambda s as String, p as List<of String> => s + p.first() * p.first())", ast, intType);
		testAST(new ExprNode(), stubField, "default String", "Default (Type String)", stringType);
		testAST(new ExprNode(), stubField, "default List<of Int>", "Default (Type List<Type Int>)", new ListType(intType));

		const ast1 = "With (p) ([Set (x) (Add (p.x) (3)), Set (y) (Minus (p.y) (1))])";
		testAST(new ExprNode(), stubField, "p with [x set to p.x + 3, y set to p.y - 1]", ast1, new ClassType("p"));
	});

	test("Unary", () => {
		testAST(new UnaryExpression(), stubField, "-3", "Minus (3)", intType);
		testAST(new UnaryExpression(), stubField, " not true", "Not (true)", boolType);
		testAST(new UnaryExpression(), stubField, " not boo", "Not (boo)", boolType);
	});

	test("Term", () => {
		testAST(new Term(), stubField, "a", "a", intType);
	});


	test("Id", () => {
		testAST(new IdentifierNode(), stubField, `a`, "a", intType);
	});

	test("Bool", () => {
		testAST(new LitBool(), stubField, " true", "true", boolType);
		testAST(new LitBool(), stubField, " false", "false", boolType);
	});

	test("Char", () => {
		testAST(new LitChar(), stubField, "'a'", "'a'", charType);
		testAST(new LitChar(), stubField, " '9'", "'9'", charType);
	});

	test("Int", () => {
		testAST(new LitInt(), stubField, " 123", "123", intType);
	});

	test("Float", () => {
		testAST(new LitFloat(), stubField, " 1.1", "1.1", floatType);
	});

	test("Brackets", () => {
		testAST(new BracketedExpression(), stubField, "(3)", "(3)", intType);
		testAST(new BracketedExpression(), stubField, "(3 + 4)", "(Add (3) (4))", intType);
		testAST(new BracketedExpression(), stubField, "(a and not b)", "(And (a) (Not (b)))", boolType);
		testAST(new BracketedExpression(), stubField, "(3 * 4 + x)", "(Multiply (3) (Add (4) (x)))", intType);
		testAST(new BracketedExpression(), stubField, "(3 * (4 + x))", "(Multiply (3) ((Add (4) (x))))", intType);
	});

	test("String", () => {

		testAST(new LitString(), stubField, `"abc"`, `"abc"`, stringType);
	});

	test("Function", () => {
		testAST(new FunctionCallNode(), stubField, `foo()`, "Func Call foo ()", intType);
		testAST(new FunctionCallNode(), stubField, `bar(x, 1, "hello")`, 'Func Call bar (x, 1, "hello")', stringType);
		testAST(new FunctionCallNode(), stubField, `bar.foo()`, "Func Call bar.foo ()", intType);
		testAST(new FunctionCallNode(), stubField, `global.foo()`, "Func Call global.foo ()", intType);
		testAST(new FunctionCallNode(), stubField, `library.foo()`, "Func Call library.foo ()", intType);
		testAST(new FunctionCallNode(), stubField, `isBefore(b[0])`, "Func Call isBefore (b[0])", boolType);
		testAST(new FunctionCallNode(), stubField, `a.isBefore(b[0])`, "Func Call a.isBefore (b[0])", boolType);
		testAST(new FunctionCallNode(), stubField, `a[0].isBefore(b[0])`, "Func Call a[0].isBefore (b[0])", boolType);
	});

	test("List", () => {
		testAST(new List(() => new LitInt()), stubField, `[1,2,3 ,4 , 5]`, "[1, 2, 3, 4, 5]", new ListType(intType));
		testAST(new List(() => new List(() => new LitInt())), stubField, `[[1,2], [3], [4,5,6]]`, "[[1, 2], [3], [4, 5, 6]]", new ListType(new ListType(intType)));
		testAST(new List(() => new LitString()), stubField, `["apple", "pear"]`, '["apple", "pear"]', new ListType(stringType));
		testAST(new List(() => new LiteralNode()), stubField, `["apple", "pear"]`, '["apple", "pear"]', new ListType(stringType));

		testAST(new List(() => new ExprNode()), stubField, `[a, 3+ 4 , func(a, 3) -1, new Foo()]`, "[a, Add (3) (4), Minus (Func Call func (a, 3)) (1), new Type Foo()]", new ListType(intType));
		testAST(new List(() => new ExprNode()), stubField, `[a, 3+ 4 , foo(a, 3) -1]`, "[a, Add (3) (4), Minus (Func Call foo (a, 3)) (1)]", new ListType(intType));
	});

	test("Types", () => {
		testAST(new TypeSimpleNode(), stubField, `Foo`, "Type Foo", new ClassType("Foo"));
		testAST(new TypeWithOptGenerics(), stubField, `Foo`, "Type Foo", new ClassType("Foo"));
		testAST(new TypeWithOptGenerics(), stubField, `Foo<of Bar>`, "Type Foo<Type Bar>", new GenericClassType("Foo", new ClassType("Bar")));
		testAST(new TypeWithOptGenerics(), stubField, `Foo<of List<of Bar>>`, "Type Foo<Type List<Type Bar>>", new GenericClassType("Foo", new ListType(new ClassType("Bar"))));
		testAST(new TypeNode(), stubField, `Foo<of List<of Bar>>`, "Type Foo<Type List<Type Bar>>", new GenericClassType("Foo", new ListType(new ClassType("Bar"))));
		testAST(new TypeNode(), stubField, `(Foo, Bar)`, "Type Tuple<Type Foo, Type Bar>", new TupleType([new ClassType("Foo"), new ClassType("Bar")]));
		testAST(new TypeNode(), stubField, `(Foo, (Bar, Yon, Qux))`, "Type Tuple<Type Foo, Type Tuple<Type Bar, Type Yon, Type Qux>>", new TupleType([new ClassType("Foo"), new TupleType([new ClassType("Bar"), new ClassType("Yon"), new ClassType("Qux")])]));
		testAST(new TypeNode(), stubField, `(Foo, Bar< of Yon>)`, "Type Tuple<Type Foo, Type Bar<Type Yon>>", new TupleType([new ClassType("Foo"), new GenericClassType("Bar", new ClassType("Yon"))]));
		testAST(new TypeNode(), stubField, `Foo<of List<of (Bar, Qux)>>`, "Type Foo<Type List<Type Tuple<Type Bar, Type Qux>>>", new GenericClassType("Foo", new ListType(new TupleType([new ClassType("Bar"), new ClassType("Qux")]))));
	});

	test("Tuple", () => {
		testAST(new TupleNode(), stubField, `("foo", 3)`, '("foo", 3)', new TupleType([stringType, intType]));
		testAST(new TupleNode(), stubField, `(foo, 3, bar(a), x)`, '(foo, 3, Func Call bar (a), x)', new TupleType([intType, intType, stringType, intType]));
	});

	test("Lambda", () => {
		testAST(new Lambda(), stubField, `lambda x as Int => x * x`, "Lambda (Param x : Type Int) => (Multiply (x) (x))", intType);
		testAST(new Lambda(), stubField, `lambda s as Int, p as List<of Int> => s + p.first()`, "Lambda (Param s : Type Int, Param p : Type List<Type Int>) => (Add (s) (Func Call p.first ()))", intType);
		testAST(new Lambda(), stubField, `lambda bestSoFar as String, newWord as String => betterOf(bestSoFar, newWord, possAnswers)`, "Lambda (Param bestSoFar : Type String, Param newWord : Type String) => (Func Call betterOf (bestSoFar, newWord, possAnswers))", stringType);
	});

	test("If", () => {
		testAST(new IfExpr(), stubField, `if cell then Colour.green else Colour.black)`, "Ternary (cell) ? ((Enum Colour).green) : ((Enum Colour).black)", new EnumType("Colour"));

		const ast2 = "Ternary (Equals (attempt[n]) ('*')) ? (attempt) : (Ternary (Func Call attempt.isYellow (target, n)) ? (Func Call attempt.setChar (n, '+')) : (Func Call attempt.setChar (n, '_')))";
		testAST(new IfExpr(), stubField, `if attempt[n] is '*' then attempt else if attempt.isYellow(target, n) then attempt.setChar(n, '+') else attempt.setChar(n, '_')`, ast2, boolType);

		const ast3 = "Ternary (Func Call attempt.isAlreadyMarkedGreen (n)) ? (target) : (Ternary (Func Call attempt.isYellow (target, n)) ? (Func Call target.setChar (Func Call target.indexOf (attempt[n]), '.')) : (target))";
		testAST(new IfExpr(), stubField, `if attempt.isAlreadyMarkedGreen(n) then target else if attempt.isYellow(target, n) then target.setChar(target.indexOf(attempt[n]), '.') else target`, ast3, stringType);

		testAST(new ParamDefNode(), stubField, `x as String`, "Param x : Type String", stringType);
	});

	ignore_test("Dictionary", () => {

		testAST(new Dictionary(() => new LitChar(), () => new LitInt()), stubField, `['a':37]`, "", intType);
		testAST(new Dictionary(() => new LitChar(), () => new LitInt()), stubField, `['a':37, 'b':42]`, "", intType);
		testAST(new Dictionary(() => new LitValueNode(), () => new LitValueNode()), stubField, `['a':37, 'b':42]`, "", intType);
		testAST(new Dictionary(() => new LitValueNode(), () => new LitValueNode()), stubField, `['a':1.0, 5:"abc"]`, "", intType);
	});

	test("LitTuple", () => {

		testAST(new LitTuple(), stubField, `(3,4)`, "(3, 4)", new TupleType([intType, intType]));
		testAST(new LitTuple(), stubField, `(3,'a', "hello", 4.1, true)`, `(3, 'a', "hello", 4.1, true)`, new TupleType([intType, charType, stringType, floatType, boolType]));
		testAST(new LitTuple(), stubField, `((3,4), ('a', true))`, "((3, 4), ('a', true))",
			new TupleType([
				new TupleType([intType, intType]),
				new TupleType([charType, boolType])
			]));

		testAST(new DeconstructedTuple(), stubField, `(a,b)`, "(a, b)", new TupleType([intType, floatType]));
	});

	test("LitNode", () => {
		testAST(new LiteralNode(), stubField, `"hello"`, `"hello"`, stringType);
		testAST(new LiteralNode(), stubField, `123`, "123", intType);
		//testAST(new LiteralNode(), stubField, `['a':37, 42:'b']`, "", intType);
		testAST(new LiteralNode(), stubField, `[(3,4), (5,6)]`, "[(3, 4), (5, 6)]", new ListType(new TupleType([intType, intType])));
		testAST(new LiteralNode(), stubField, `["apple", "pear"]`, `["apple", "pear"]`, new ListType(stringType));
	});

	test("Var", () => {
		testAST(new VarRefNode(), stubField, `a`, "a", intType);
		//testAST(new VarRefNode(), stubField, `result`, "", intType);
		testAST(new VarRefNode(), stubField, `lst`, "lst", new ListType(intType));
		testAST(new VarRefNode(), stubField, `lst[3]`, "lst[3]", intType);
		testAST(new VarRefNode(), stubField, `library.foo`, "library.foo", intType);
		testAST(new VarRefNode(), stubField, `global.lst[3]`, "global.lst[3]", intType);
		testAST(new VarRefNode(), stubField, `property.lst[3..4]`, "property.lst[Range 3..4]", intType);
		testAST(new VarRefNode(), stubField, `bar.lst[..4]`, "bar.lst[Range ..4]", intType);
		//testAST(new VarRefNode(), stubField, `property.bar.foo`, "property.bar.foo", intType);
	});

	ignore_test("DeconList", () => {
		//testAST(new DeconstructedList(), stubField, `[a:b]`, "[a:b]");
	});

	test("New", () => {
		testAST(new NewInstance(), stubField, `new Foo()`, "new Type Foo()", new ClassType("Foo"));
	});
});