import * as vscode from 'vscode';
import { ExprNode } from '../frames/parse-nodes/expr-node';
import { ParseStatus } from '../frames/parse-status';
import { testNodeParse } from './testHelpers';
import { LitBool } from '../frames/parse-nodes/lit-bool';
import { LitChar } from '../frames/parse-nodes/lit-char';
import { LitInt } from '../frames/parse-nodes/lit-int';
import { LitFloat } from '../frames/parse-nodes/lit-float';
import { BinaryOperation } from '../frames/parse-nodes/binary-operation';
import { UnaryExpression } from '../frames/parse-nodes/unary-expression';
import { BracketedExpression } from '../frames/parse-nodes/bracketed-expression';
import { Optional } from '../frames/parse-nodes/optional';
import { LitString } from '../frames/parse-nodes/lit-string';
import { List } from '../frames/parse-nodes/list';
import { Multiple } from '../frames/parse-nodes/multiple';
import { CSV } from '../frames/parse-nodes/csv';
import { IdentifierNode } from '../frames/parse-nodes/identifier-node';
import { FunctionCallNode } from '../frames/parse-nodes/function-call-node';
import { KeywordNode } from '../frames/parse-nodes/keyword-node';
import { IndexableTerm } from '../frames/parse-nodes/indexed-term';
import { TypeNode } from '../frames/parse-nodes/type-node';
import { TypeWithOptGenerics } from '../frames/parse-nodes/type-with-opt-generics';
import { TypeSimpleNode } from '../frames/parse-nodes/type-simple-node';
import { TupleDefNode } from '../frames/parse-nodes/tuple-def-node';
import { Lambda } from '../frames/parse-nodes/lambda';
import { IfExpr } from '../frames/parse-nodes/if-expr';
import { ParamDefNode } from '../frames/parse-nodes/param-def-node';
import { Term } from '../frames/parse-nodes/term';
import { DottedTerm } from '../frames/parse-nodes/dotted-term';
import { Field } from '../frames/interfaces/field';
import { IntType } from '../symbols/IntType';
import { FloatType } from '../symbols/FloatType';
import { BooleanType } from '../symbols/BooleanType';
import { CharType } from '../symbols/CharType';
import { StringType } from '../symbols/StringType';
import { UnknownType } from '../symbols/UnknownType';
import { ClassType } from '../symbols/ClassType';
import { ListType } from '../symbols/ListType';
import { TupleType } from '../symbols/TupleType';


suite('FieldNode parsing', () => {

	const stubField = {
		
	} as Field;

	const intType = IntType.Instance;
	const floatType = FloatType.Instance;
	const boolType = BooleanType.Instance;
	const charType = CharType.Instance;
	const stringType = StringType.Instance;
	const unknownType = UnknownType.Instance;


	vscode.window.showInformationMessage('Start all unit tests.');
	test('UnaryExpression', () => {
		testNodeParse(new UnaryExpression(stubField),"", ParseStatus.empty, "", "","", "", undefined);
		testNodeParse(new UnaryExpression(stubField),"-3", ParseStatus.valid, "-3", "","-3", "", intType);
		testNodeParse(new UnaryExpression(stubField)," not foo", ParseStatus.valid, " not foo", "","not foo", "");
		testNodeParse(new UnaryExpression(stubField),"-", ParseStatus.incomplete, "-", "","-", "", undefined);
		testNodeParse(new UnaryExpression(stubField),"+4", ParseStatus.invalid, "", "+4","", "", undefined);
	});
	test('BinOp', () => {
		testNodeParse(new BinaryOperation(stubField),"", ParseStatus.empty, "", "","");
		testNodeParse(new BinaryOperation(stubField),"  ", ParseStatus.empty, "", "  ","");
		testNodeParse(new BinaryOperation(stubField),"+", ParseStatus.valid, "+", ""," + ","", unknownType);
		testNodeParse(new BinaryOperation(stubField),"-", ParseStatus.valid, "-", ""," - ","", unknownType);
		testNodeParse(new BinaryOperation(stubField),"*", ParseStatus.valid, "*", ""," * ","", unknownType);
		testNodeParse(new BinaryOperation(stubField),"/", ParseStatus.valid, "/", ""," / ", "", floatType);
		testNodeParse(new BinaryOperation(stubField),">", ParseStatus.valid, ">", ""," > ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),"<", ParseStatus.valid, "<", ""," < ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),">=", ParseStatus.valid, ">=", ""," >= ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),"<=", ParseStatus.valid, "<=", ""," <= ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),"< =", ParseStatus.valid, "<", " ="," < ", "", boolType);

		testNodeParse(new BinaryOperation(stubField),"is", ParseStatus.valid, "is", ""," is ", "", boolType);
		//testNodeParse(new BinaryOperation(stubField),"is not", ParseStatus.valid, "is not", ""," is not ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),"and", ParseStatus.valid, "and", ""," and ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),"or", ParseStatus.valid, "or", ""," or ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),"xor", ParseStatus.valid, "xor", ""," xor ", "", boolType);
		testNodeParse(new BinaryOperation(stubField),"mod", ParseStatus.valid, "mod", ""," mod ", "", intType);
		testNodeParse(new BinaryOperation(stubField),"div", ParseStatus.valid, "div", ""," div ", "", intType);
		testNodeParse(new BinaryOperation(stubField),"d", ParseStatus.incomplete, "d", "","");
		testNodeParse(new BinaryOperation(stubField),"%", ParseStatus.invalid, "", "%","");
	});
	test('IndexableTerm', () => {
		testNodeParse(new Term(stubField),"a", ParseStatus.valid, "a", "","a");
	});
	test('Term', () => {
		testNodeParse(new Term(stubField),"", ParseStatus.empty, "", "","");
		testNodeParse(new Term(stubField),"a", ParseStatus.valid, "a", "","a");
	});
	test('Expression', () => {
		testNodeParse(new ExprNode(stubField),"", ParseStatus.empty, "", "","");
		testNodeParse(new ExprNode(stubField),"  ", ParseStatus.empty, "", "  ","");
		testNodeParse(new ExprNode(stubField),"a", ParseStatus.valid, "a", "","a");
		testNodeParse(new ExprNode(stubField),"a + b", ParseStatus.valid, "a + b", "","a + b");
		testNodeParse(new ExprNode(stubField), "a + b-c", ParseStatus.valid, "a + b-c", "","a + b - c");
		testNodeParse(new ExprNode(stubField), "+", ParseStatus.invalid, "", "+","");
		testNodeParse(new ExprNode(stubField),"+b", ParseStatus.invalid, "", "+b","");
		testNodeParse(new ExprNode(stubField), "a +", ParseStatus.incomplete, "a +", "","a + ");
		testNodeParse(new ExprNode(stubField), "a %", ParseStatus.valid, "a", " %","a");
		testNodeParse(new ExprNode(stubField), "3 * 4 + x", ParseStatus.valid, "3 * 4 + x", "","3 * 4 + x");
		testNodeParse(new ExprNode(stubField), "3*foo(5)", ParseStatus.valid, "3*foo(5)", "","3 * foo(5)");
		testNodeParse(new ExprNode(stubField), "points.foo(0.0)", ParseStatus.valid, "points.foo(0.0)", "","points.foo(0.0)");
		testNodeParse(new ExprNode(stubField), "reduce(0.0, lambda s as String, p as List<of String> return s + p.first() * p.first())", ParseStatus.valid, "reduce(0.0, lambda s as String, p as List<of String> return s + p.first() * p.first())", "","");
	});
	test('VariableNode', () => {
		testNodeParse(new IdentifierNode(stubField),``, ParseStatus.empty, ``, "","");
		testNodeParse(new IdentifierNode(stubField),`  `, ParseStatus.empty, ``, "  ","");
		testNodeParse(new IdentifierNode(stubField),`a`, ParseStatus.valid, `a`, "","a");
		testNodeParse(new IdentifierNode(stubField),`aB_d`, ParseStatus.valid, `aB_d`, "","aB_d");
		testNodeParse(new IdentifierNode(stubField),`abc `, ParseStatus.valid, `abc`, " ","abc");
		testNodeParse(new IdentifierNode(stubField),`Abc`, ParseStatus.invalid, ``, "Abc","");
		testNodeParse(new IdentifierNode(stubField),`abc-de`, ParseStatus.valid, `abc`, "-de","abc");
	});
	test('LitBool', () => {
		testNodeParse(new LitBool(stubField), "", ParseStatus.empty, "", "","", "", boolType);
		testNodeParse(new LitBool(stubField), " true", ParseStatus.valid, " true", "","true ", "", boolType);
		testNodeParse(new LitBool(stubField), " trueX", ParseStatus.valid, " true", "X","true ", "", boolType);
		testNodeParse(new LitBool(stubField), " false", ParseStatus.valid, " false", "","false ", "", boolType);
		testNodeParse(new LitBool(stubField), " True", ParseStatus.invalid, "", " True","", "", boolType);
		testNodeParse(new LitBool(stubField), "is True", ParseStatus.invalid, "", "is True","", "", boolType);
		testNodeParse(new LitBool(stubField), " tr", ParseStatus.incomplete, " tr", "","tr ", "", boolType);
		testNodeParse(new LitBool(stubField), " tr ", ParseStatus.invalid, "", " tr ","", "", boolType);
	});
	test('LitChar', () => {
		testNodeParse(new LitChar(stubField), "", ParseStatus.empty, "", "","", "", charType);
		testNodeParse(new LitChar(stubField), "'a'", ParseStatus.valid, "'a'", "","'a'", "", charType);
		testNodeParse(new LitChar(stubField), " '9'", ParseStatus.valid, " '9'", "","'9'", "", charType);
		testNodeParse(new LitChar(stubField), "'ab'", ParseStatus.invalid, "", "'ab'","", "", charType);
		testNodeParse(new LitChar(stubField), `"a"`, ParseStatus.invalid, "", `"a"`,"", "", charType);
	});
	test('LitInt', () => {
		testNodeParse(new LitInt(stubField), "", ParseStatus.empty, "", "","", "", intType);
		testNodeParse(new LitInt(stubField), "   ", ParseStatus.empty, "", "   ","","", intType);
		testNodeParse(new LitInt(stubField), "123", ParseStatus.valid, "123", "","123","", intType);
		testNodeParse(new LitInt(stubField), "456  ", ParseStatus.valid, "456", "  ","456","", intType);
		testNodeParse(new LitInt(stubField), " 123a", ParseStatus.valid, " 123", "a","123","", intType);
		testNodeParse(new LitInt(stubField), "1.23", ParseStatus.valid, "1", ".23","1","", intType);
		testNodeParse(new LitInt(stubField), "a", ParseStatus.invalid, "", "a","","", intType);
	});
	test('LitFloat', () => {
		testNodeParse(new LitFloat(stubField), "", ParseStatus.empty, "", "","");
		testNodeParse(new LitFloat(stubField), "1.0", ParseStatus.valid, "1.0", "","1.0");
		testNodeParse(new LitFloat(stubField), " 1.0a", ParseStatus.valid, " 1.0", "a","1.0");
		testNodeParse(new LitFloat(stubField), "1", ParseStatus.incomplete, "1", "","1");
		testNodeParse(new LitFloat(stubField), "1.", ParseStatus.incomplete, "1.", "","1.");
		testNodeParse(new LitFloat(stubField), "1. ", ParseStatus.incomplete, "1.", " ","1.");
		testNodeParse(new LitFloat(stubField), "1.1e5", ParseStatus.valid, "1.1e5", "","1.1e5");
		testNodeParse(new LitFloat(stubField), "1.1e-5", ParseStatus.valid, "1.1e-5", "","1.1e-5");
	});
	test('Keyword', () => {
		testNodeParse(new KeywordNode("abstract", stubField), "", ParseStatus.empty, "", "","");
		testNodeParse(new KeywordNode("abstract", stubField), "abstract ", ParseStatus.valid, "abstract", "","");
		testNodeParse(new KeywordNode("abstract", stubField), "abstract(x", ParseStatus.valid, "abstract", "(x","");
		testNodeParse(new KeywordNode("abstract", stubField), "abstractx", ParseStatus.invalid, "", "abstractx","");
		testNodeParse(new KeywordNode("abstract", stubField), "abstract immutable", ParseStatus.valid, "abstract", " immutable","abstract ");
		testNodeParse(new KeywordNode("abstract", stubField), " abs", ParseStatus.incomplete, " abs", "","abs ");
		testNodeParse(new KeywordNode("abstract", stubField), " abscract", ParseStatus.invalid, "", " abscract","");
	});
	test('BracketedExpression', () => {
		// testNodeParse(new BracketedExpression(stubField),"", ParseStatus.empty, "", "","");
		testNodeParse(new BracketedExpression(stubField),"(3)", ParseStatus.valid, "(3)", "","(3)", "", intType);
		testNodeParse(new BracketedExpression(stubField),"(3 + 4)", ParseStatus.valid, "(3 + 4)", "","(3 + 4)", "", intType);
		testNodeParse(new BracketedExpression(stubField),"(a and not b)", ParseStatus.valid, "(a and not b)", "","(a and not b)");
		testNodeParse(new BracketedExpression(stubField),"(3 * 4 + x)", ParseStatus.valid, "(3 * 4 + x)", "","(3 * 4 + x)");
		testNodeParse(new BracketedExpression(stubField),"(3 * (4 + x))", ParseStatus.valid, "(3 * (4 + x))", "","(3 * (4 + x))");
		testNodeParse(new BracketedExpression(stubField),"(a and not b", ParseStatus.incomplete, "(a and not b", "","(a and not b");
		testNodeParse(new BracketedExpression(stubField),"(a and not b  ", ParseStatus.incomplete, "(a and not b", "  ","(a and not b");
		testNodeParse(new BracketedExpression(stubField),"(", ParseStatus.incomplete, "(", "","(");
		testNodeParse(new BracketedExpression(stubField),"()", ParseStatus.invalid, "", "()","(");// TODO - change this?
	});
	test('Optional', () => {
		testNodeParse(new Optional(() => new LitInt(stubField), stubField),"123 a", ParseStatus.valid, "123", " a","123");
		testNodeParse(new Optional(() => new LitInt(stubField), stubField), "abc", ParseStatus.valid, "", "abc","");
		testNodeParse(new Optional(() => new KeywordNode("abstract", stubField), stubField), " abstract", ParseStatus.valid, " abstract", "","abstract ","<keyword>abstract </keyword>");
		testNodeParse(new Optional(() => new KeywordNode("abstract", stubField), stubField), "abs", ParseStatus.incomplete, "abs", "","");
		testNodeParse(new Optional(() => new KeywordNode("abstract", stubField), stubField), "abscract", ParseStatus.valid, "", "abscract","");
		testNodeParse(new Optional(() => new KeywordNode("abstract", stubField), stubField), "", ParseStatus.valid, "", "","");
		testNodeParse(new Optional(() => new KeywordNode("abstract", stubField), stubField), "  ", ParseStatus.valid, "", "  ","");
	});
	test('LitString', () => {
		testNodeParse(new LitString(stubField),`"abc"`, ParseStatus.valid, `"abc"`, "","",`<string>"abc"</string>`, stringType);
		testNodeParse(new LitString(stubField),`"abc`, ParseStatus.incomplete, `"abc`, "","", "", stringType);
		testNodeParse(new LitString(stubField),`"`, ParseStatus.incomplete, `"`, "","", "", stringType);
		testNodeParse(new LitString(stubField),`abc`, ParseStatus.invalid, "", "abc","", "", stringType);
		testNodeParse(new LitString(stubField),`'abc'`, ParseStatus.invalid, "", "'abc'","", "", stringType);
	});
	test('Multiple', () => {
		testNodeParse(new Multiple(() => new LitInt(stubField), 0, stubField),``, ParseStatus.valid, ``, "","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 1, stubField),``, ParseStatus.empty, ``, "","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 0, stubField),`)`, ParseStatus.valid, ``, ")","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 1, stubField),`1 0 33`, ParseStatus.valid, `1 0 33`, "","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 1, stubField),`1`, ParseStatus.valid, `1`, "","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 0, stubField),``, ParseStatus.valid, ``, "","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 1, stubField),``, ParseStatus.empty, ``, "","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 1, stubField),`5 6 a`, ParseStatus.valid, `5 6`, " a","");
		testNodeParse(new Multiple(() => new LitInt(stubField), 1, stubField),`7   `, ParseStatus.valid, `7`, "   ","");

		testNodeParse(new Multiple(() => new KeywordNode("foo", stubField), 1, stubField),`foo foo`, ParseStatus.valid, "", "","");
		testNodeParse(new Multiple(() => new KeywordNode("bar", stubField), 1, stubField),`bar ba`, ParseStatus.incomplete, "bar ba", "","");
		testNodeParse(new Multiple(() => new KeywordNode("foo", stubField), 1, stubField),`foo`, ParseStatus.valid, "", "","");
		testNodeParse(new Multiple(() => new KeywordNode("foo", stubField), 1, stubField),`fo`, ParseStatus.incomplete, "", "","");
		testNodeParse(new Multiple(() => new KeywordNode("foo", stubField), 1, stubField),`foo,foo`, ParseStatus.valid, "", ",foo","");
		testNodeParse(new Multiple(() => new KeywordNode("foo", stubField), 1, stubField),`foofoo`, ParseStatus.invalid, "", "foofoo","");
	});
	test('CSV', () => {
		testNodeParse(new CSV(() => new LitInt(stubField),0, stubField),``, ParseStatus.valid, ``, "","");
		testNodeParse(new CSV(() => new LitInt(stubField),1, stubField),``, ParseStatus.empty, ``, "","");
		testNodeParse(new CSV(() => new LitInt(stubField),0, stubField),`2, 4,3 , 1 `, ParseStatus.valid, `2, 4,3 , 1`, " ","2, 4, 3, 1");
 		testNodeParse(new CSV(() => new LitInt(stubField),0, stubField),`2`, ParseStatus.valid, `2`, "","");
		testNodeParse(new CSV(() => new LitInt(stubField),1, stubField),`2`, ParseStatus.valid, `2`, "","");
		testNodeParse(new CSV(() => new LitString(stubField),0, stubField),`"apple","orange" , "pear"`, ParseStatus.valid, `"apple","orange" , "pear"`, "",`"apple", "orange", "pear"`);
		testNodeParse(new CSV(() => new IdentifierNode(stubField),0, stubField),`a,b,c`, ParseStatus.valid, `a,b,c`, "","");
		testNodeParse(new CSV(() => new IdentifierNode(stubField),0, stubField),`a,b,1`, ParseStatus.valid, `a,b`, ",1","");
		testNodeParse(new CSV(() => new ExprNode(stubField),0, stubField),`a + b,c, 1`, ParseStatus.valid, `a + b,c, 1`, "","");
		testNodeParse(new CSV(() => new ExprNode(stubField),0, stubField),`)`, ParseStatus.valid, ``, ")","");

		testNodeParse(new CSV(() => new KeywordNode("foo", stubField),0, stubField),`foo, foo `, ParseStatus.valid, "","");
		testNodeParse(new CSV(() => new KeywordNode("foo", stubField),0, stubField),`foo `, ParseStatus.valid, "","");
		testNodeParse(new CSV(() => new KeywordNode("foo", stubField),1, stubField),`fook `, ParseStatus.invalid, "","");
		testNodeParse(new CSV(() => new KeywordNode("foo", stubField),0, stubField),`fo`, ParseStatus.incomplete, "fo","");
		testNodeParse(new CSV(() => new KeywordNode("foo", stubField),2, stubField),`foo, fo`, ParseStatus.incomplete, "foo, fo","");

		testNodeParse(new CSV(() => new ExprNode(stubField),0, stubField),``, ParseStatus.valid, "","");
	});
	test('Function Call', () => {
		testNodeParse(new FunctionCallNode(stubField),``, ParseStatus.empty, ``, "","");
		testNodeParse(new FunctionCallNode(stubField),`  `, ParseStatus.empty, ``, "  ","");
		testNodeParse(new FunctionCallNode(stubField),`foo()`, ParseStatus.valid, `foo()`, "","");
		testNodeParse(new FunctionCallNode(stubField),`bar(x, 1, "hello")`, ParseStatus.valid, `bar(x, 1, "hello")`, "","");	
		testNodeParse(new FunctionCallNode(stubField),`yon`, ParseStatus.incomplete, `yon`, "","");
		testNodeParse(new FunctionCallNode(stubField),`yon `, ParseStatus.incomplete, `yon`, " ","");
		testNodeParse(new FunctionCallNode(stubField),`yon(`, ParseStatus.incomplete, `yon(`, "","");
		testNodeParse(new FunctionCallNode(stubField),`yon(a`, ParseStatus.incomplete, `yon(a`, "","");
		testNodeParse(new FunctionCallNode(stubField),`yon(a,`, ParseStatus.incomplete, `yon(a,`, "","");
		testNodeParse(new FunctionCallNode(stubField),`Foo()`, ParseStatus.invalid, ``, "Foo()","");
		testNodeParse(new FunctionCallNode(stubField),`foo[]`, ParseStatus.invalid, ``, "foo[]","");
	});
	test('Lists', () => {
		testNodeParse(new List(() => new LitInt(stubField), stubField),``, ParseStatus.empty, ``, "","");
		testNodeParse(new List(() => new LitInt(stubField), stubField),`[1,2,3 ,4 , 5]`, ParseStatus.valid, `[1,2,3 ,4 , 5]`, "","", "");
		testNodeParse(new List(() => new LitInt(stubField), stubField),`[]`, ParseStatus.valid, `[]`, "","");
		testNodeParse(new List(() => new LitInt(stubField), stubField),`[`, ParseStatus.incomplete, `[`, "","");
		testNodeParse(new List(() => new LitInt(stubField), stubField),`[1,2,3.1]`, ParseStatus.invalid, ``, "[1,2,3.1]","");
		// list of list
		testNodeParse(new List(() => new List(() => new LitInt(stubField), stubField), stubField),``, ParseStatus.empty, ``, "","");
		testNodeParse(new List(() => new List(() => new LitInt(stubField), stubField), stubField),`[[], [], [ ]]`, ParseStatus.valid, `[[], [], [ ]]`, "","");
		testNodeParse(new List(() => new List(() => new LitInt(stubField), stubField), stubField),`[[1,2], [], [3,4]]`, ParseStatus.valid, `[[1,2], [], [3,4]]`, "","","");
		testNodeParse(new List(() => new List(() => new LitInt(stubField), stubField), stubField),`[[1,2], [], [3,4]`, ParseStatus.incomplete, `[[1,2], [], [3,4]`, "","");
		testNodeParse(new List(() => new List(() => new LitInt(stubField), stubField), stubField),`[[1,2, [], [3,4]]`, ParseStatus.invalid, ``, `[[1,2, [], [3,4]]`,"");
	});
	test('Indexed term', () => {
		testNodeParse(new IndexableTerm(stubField),`foo[3]`, ParseStatus.valid, "foo[3]","","");
		testNodeParse(new IndexableTerm(stubField),`foo[bar]`, ParseStatus.valid, "foo[bar]","","");
		testNodeParse(new IndexableTerm(stubField),`foo[3..4]`, ParseStatus.valid, "foo[3..4]","","");
		testNodeParse(new IndexableTerm(stubField),`foo[3..]`, ParseStatus.valid, "foo[3..]","","");
		testNodeParse(new IndexableTerm(stubField),`foo[..4]`, ParseStatus.valid, "foo[..4]","","");
	});
	test('List of expressions', () => {
		testNodeParse(new List(() => new ExprNode(stubField), stubField),`[a, 3+ 4 , func(a, 3) -1, new Foo()]`, ParseStatus.valid, "[a, 3+ 4 , func(a, 3) -1, new Foo()]","","");
	});
	test('TypeSimpleNode', () => {
		testNodeParse(new TypeSimpleNode(stubField),`Foo`, ParseStatus.valid, "Foo","","","<type>Foo</type>", new ClassType("Foo"));
		testNodeParse(new TypeSimpleNode(stubField),`foo`, ParseStatus.invalid, "","foo","");
	});
	test('TypeWithOptGenerics', () => {
		testNodeParse(new TypeWithOptGenerics(stubField),`Foo`, ParseStatus.valid, "Foo","","");
		testNodeParse(new TypeWithOptGenerics(stubField),`foo`, ParseStatus.invalid, "","foo","");
		testNodeParse(new TypeWithOptGenerics(stubField),`Foo<`, ParseStatus.incomplete, "Foo<","","");
		testNodeParse(new TypeWithOptGenerics(stubField),`Foo<of`, ParseStatus.incomplete, "Foo<of","","");
		testNodeParse(new TypeWithOptGenerics(stubField),`Foo<of Bar`, ParseStatus.incomplete, "Foo<of Bar","","");
		testNodeParse(new TypeWithOptGenerics(stubField),`Foo<of Bar>`, ParseStatus.valid, "Foo<of Bar>","","","<type>Foo</type>&lt;<keyword>of </keyword><type>Bar</type>&gt;");
		testNodeParse(new TypeWithOptGenerics(stubField),`Foo<of List<of Bar>>`, ParseStatus.valid, "Foo<of List<of Bar>>","","","<type>Foo</type>&lt;<keyword>of </keyword><type>List</type>&lt;<keyword>of </keyword><type>Bar</type>&gt;&gt;");
	});
	test('TypeNode', () => {
		testNodeParse(new TypeNode(stubField),`Foo<of List<of Bar>>`, ParseStatus.valid, "Foo<of List<of Bar>>","","");//Single
		testNodeParse(new TypeNode(stubField),`(Foo, Bar)`, ParseStatus.valid, "(Foo, Bar)","","");
		testNodeParse(new TypeNode(stubField),`(Foo)`, ParseStatus.invalid, "","(Foo)","");
		testNodeParse(new TypeNode(stubField),`(Foo, Bar, Yon`, ParseStatus.incomplete, "(Foo, Bar, Yon","","");
		testNodeParse(new TypeNode(stubField),`(Foo, (Bar, Yon, Qux))`, ParseStatus.valid, "(Foo, (Bar, Yon, Qux))","","");
		testNodeParse(new TypeNode(stubField),`(Foo, Bar< of Yon>)`, ParseStatus.valid, "(Foo, Bar< of Yon>)","","");
		testNodeParse(new TypeNode(stubField),`Foo<of List<of (Bar, Qux)>>`, ParseStatus.valid, "Foo<of List<of (Bar, Qux)>>","","");
	});
	test('TupleDefNode', () => {
		//testNodeParse(new TupleDefNode(stubField),`("foo", 3)`, ParseStatus.valid, '("foo", 3)',"","", "", new TupleType([stringType, intType]));
		testNodeParse(new TupleDefNode(stubField),`(foo, 3, bar(a), x)`, ParseStatus.valid, "(foo, 3, bar(a), x)","","");
		testNodeParse(new TupleDefNode(stubField),`(foo)`, ParseStatus.invalid, "","(foo)","");
		testNodeParse(new TupleDefNode(stubField),`(foo, 3, bar(a), x`, ParseStatus.incomplete, "(foo, 3, bar(a), x","","");
	});
	test('Lambda', () => {
		testNodeParse(new Lambda(stubField),`lambda x as Int return x * x`, ParseStatus.valid, "lambda x as Int return x * x","","");
		testNodeParse(new Lambda(stubField),`lambda x`, ParseStatus.incomplete, "lambda x","","");
		testNodeParse(new Lambda(stubField),`lambda x return x * x`, ParseStatus.invalid, "","lambda x return x * x","");
		testNodeParse(new Lambda(stubField),`lambda s as Int, p as List<of Int> return s + p.first()`, ParseStatus.valid, "","","");
	});
	test('IfExpr', () => {
		testNodeParse(new IfExpr(stubField),`if cell then Colour.green else Colour.black)`, ParseStatus.valid, "","","");
		testNodeParse(new IfExpr(stubField),`if cell then Colour.amber`, ParseStatus.incomplete, "","","");
		testNodeParse(new IfExpr(stubField),`if attempt[n] is '*' then attempt  else if attempt.isYellow(target, n) then (attempt.setChar(n, '+')  else attempt.setChar(n, '_')`, ParseStatus.valid, "","","");
		testNodeParse(new IfExpr(stubField),`if attempt.isAlreadyMarkedGreen(n) then target else if attempt.isYellow(target, n) then (target.setChar(target.indexOf(attempt[n]), '.') else target))`, ParseStatus.valid, "","","");
	});
	test('ParamDefNode', () => {
		testNodeParse(new ParamDefNode(stubField),`a as String`, ParseStatus.valid, "a as String","","");
		testNodeParse(new ParamDefNode(stubField),`a`, ParseStatus.incomplete, "a","","");
		testNodeParse(new ParamDefNode(stubField),`a as`, ParseStatus.incomplete, "a as","","");
		testNodeParse(new ParamDefNode(stubField),`A`, ParseStatus.invalid, "","","");
		testNodeParse(new ParamDefNode(stubField),`a String`, ParseStatus.invalid, "","a String","");
	});
	test('Param List', () => {
		testNodeParse(new CSV(() => new ParamDefNode(stubField), 0, stubField),`A as string`, ParseStatus.valid, "","A as string",""); //i.e. all leftover
 		testNodeParse(new CSV(() => new ParamDefNode(stubField), 0, stubField),``, ParseStatus.valid, "","","");
		testNodeParse(new CSV(() => new ParamDefNode(stubField), 0, stubField),`a as String`, ParseStatus.valid, "","","");
		testNodeParse(new CSV(() => new ParamDefNode(stubField), 0, stubField),`a as String, bb as Int, foo as Bar`, ParseStatus.valid, "","","");
		testNodeParse(new CSV(() => new ParamDefNode(stubField), 0, stubField),`a`, ParseStatus.incomplete, "a","","");
		testNodeParse(new CSV(() => new ParamDefNode(stubField), 0, stubField),`a as String,`, ParseStatus.incomplete, "a as String,","","");
		testNodeParse(new CSV(() => new ParamDefNode(stubField), 0, stubField),`a as String, bb as`, ParseStatus.incomplete, "","","");
	});
	test('DottedTerm', () => {
		testNodeParse(new DottedTerm(stubField),`foo.bar()`, ParseStatus.valid, "foo.bar()","","foo.bar()","foo.<method>bar</method>()");
	});
});