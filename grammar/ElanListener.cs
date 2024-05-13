//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     ANTLR Version: 4.13.1
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

// Generated from c://Elan//IDE//grammar//Elan.g4 by ANTLR 4.13.1

// Unreachable code detected
#pragma warning disable 0162
// The variable '...' is assigned but its value is never used
#pragma warning disable 0219
// Missing XML comment for publicly visible type or member '...'
#pragma warning disable 1591
// Ambiguous reference in cref attribute
#pragma warning disable 419

using Antlr4.Runtime.Misc;
using IParseTreeListener = Antlr4.Runtime.Tree.IParseTreeListener;
using IToken = Antlr4.Runtime.IToken;

/// <summary>
/// This interface defines a complete listener for a parse tree produced by
/// <see cref="ElanParser"/>.
/// </summary>
[System.CodeDom.Compiler.GeneratedCode("ANTLR", "4.13.1")]
[System.CLSCompliant(false)]
public interface IElanListener : IParseTreeListener {
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.file"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterFile([NotNull] ElanParser.FileContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.file"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitFile([NotNull] ElanParser.FileContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.comment"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterComment([NotNull] ElanParser.CommentContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.comment"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitComment([NotNull] ElanParser.CommentContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.importStatement"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterImportStatement([NotNull] ElanParser.ImportStatementContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.importStatement"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitImportStatement([NotNull] ElanParser.ImportStatementContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.namespace"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterNamespace([NotNull] ElanParser.NamespaceContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.namespace"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitNamespace([NotNull] ElanParser.NamespaceContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.global"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterGlobal([NotNull] ElanParser.GlobalContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.global"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitGlobal([NotNull] ElanParser.GlobalContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.main"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterMain([NotNull] ElanParser.MainContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.main"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitMain([NotNull] ElanParser.MainContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.procedure"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterProcedure([NotNull] ElanParser.ProcedureContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.procedure"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitProcedure([NotNull] ElanParser.ProcedureContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.function"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterFunction([NotNull] ElanParser.FunctionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.function"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitFunction([NotNull] ElanParser.FunctionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.constant"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterConstant([NotNull] ElanParser.ConstantContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.constant"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitConstant([NotNull] ElanParser.ConstantContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.class"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterClass([NotNull] ElanParser.ClassContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.class"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitClass([NotNull] ElanParser.ClassContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.enum"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterEnum([NotNull] ElanParser.EnumContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.enum"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitEnum([NotNull] ElanParser.EnumContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.test"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterTest([NotNull] ElanParser.TestContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.test"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitTest([NotNull] ElanParser.TestContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.procedureSignature"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterProcedureSignature([NotNull] ElanParser.ProcedureSignatureContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.procedureSignature"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitProcedureSignature([NotNull] ElanParser.ProcedureSignatureContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.paramList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterParamList([NotNull] ElanParser.ParamListContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.paramList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitParamList([NotNull] ElanParser.ParamListContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.paramDef"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterParamDef([NotNull] ElanParser.ParamDefContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.paramDef"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitParamDef([NotNull] ElanParser.ParamDefContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.functionSignature"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterFunctionSignature([NotNull] ElanParser.FunctionSignatureContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.functionSignature"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitFunctionSignature([NotNull] ElanParser.FunctionSignatureContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.statementBlock"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterStatementBlock([NotNull] ElanParser.StatementBlockContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.statementBlock"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitStatementBlock([NotNull] ElanParser.StatementBlockContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.singleLineStatement"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterSingleLineStatement([NotNull] ElanParser.SingleLineStatementContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.singleLineStatement"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitSingleLineStatement([NotNull] ElanParser.SingleLineStatementContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.multiLineStatement"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterMultiLineStatement([NotNull] ElanParser.MultiLineStatementContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.multiLineStatement"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitMultiLineStatement([NotNull] ElanParser.MultiLineStatementContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.var"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterVar([NotNull] ElanParser.VarContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.var"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitVar([NotNull] ElanParser.VarContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.set"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterSet([NotNull] ElanParser.SetContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.set"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitSet([NotNull] ElanParser.SetContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.call"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterCall([NotNull] ElanParser.CallContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.call"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitCall([NotNull] ElanParser.CallContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.throw"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterThrow([NotNull] ElanParser.ThrowContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.throw"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitThrow([NotNull] ElanParser.ThrowContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.print"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterPrint([NotNull] ElanParser.PrintContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.print"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitPrint([NotNull] ElanParser.PrintContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.input"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterInput([NotNull] ElanParser.InputContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.input"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitInput([NotNull] ElanParser.InputContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.assert"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterAssert([NotNull] ElanParser.AssertContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.assert"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitAssert([NotNull] ElanParser.AssertContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.let"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLet([NotNull] ElanParser.LetContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.let"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLet([NotNull] ElanParser.LetContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.assignableValue"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterAssignableValue([NotNull] ElanParser.AssignableValueContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.assignableValue"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitAssignableValue([NotNull] ElanParser.AssignableValueContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.methodCall"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterMethodCall([NotNull] ElanParser.MethodCallContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.methodCall"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitMethodCall([NotNull] ElanParser.MethodCallContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.argList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterArgList([NotNull] ElanParser.ArgListContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.argList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitArgList([NotNull] ElanParser.ArgListContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.if"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterIf([NotNull] ElanParser.IfContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.if"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitIf([NotNull] ElanParser.IfContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.else"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterElse([NotNull] ElanParser.ElseContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.else"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitElse([NotNull] ElanParser.ElseContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.for"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterFor([NotNull] ElanParser.ForContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.for"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitFor([NotNull] ElanParser.ForContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.each"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterEach([NotNull] ElanParser.EachContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.each"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitEach([NotNull] ElanParser.EachContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.while"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterWhile([NotNull] ElanParser.WhileContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.while"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitWhile([NotNull] ElanParser.WhileContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.repeat"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterRepeat([NotNull] ElanParser.RepeatContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.repeat"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitRepeat([NotNull] ElanParser.RepeatContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.try"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterTry([NotNull] ElanParser.TryContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.try"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitTry([NotNull] ElanParser.TryContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.switch"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterSwitch([NotNull] ElanParser.SwitchContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.switch"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitSwitch([NotNull] ElanParser.SwitchContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.case"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterCase([NotNull] ElanParser.CaseContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.case"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitCase([NotNull] ElanParser.CaseContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.defaultCase"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterDefaultCase([NotNull] ElanParser.DefaultCaseContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.defaultCase"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitDefaultCase([NotNull] ElanParser.DefaultCaseContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.mutableClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterMutableClass([NotNull] ElanParser.MutableClassContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.mutableClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitMutableClass([NotNull] ElanParser.MutableClassContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.abstractClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterAbstractClass([NotNull] ElanParser.AbstractClassContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.abstractClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitAbstractClass([NotNull] ElanParser.AbstractClassContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.immutableClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterImmutableClass([NotNull] ElanParser.ImmutableClassContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.immutableClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitImmutableClass([NotNull] ElanParser.ImmutableClassContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.abstractImmutableClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterAbstractImmutableClass([NotNull] ElanParser.AbstractImmutableClassContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.abstractImmutableClass"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitAbstractImmutableClass([NotNull] ElanParser.AbstractImmutableClassContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.inherits"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterInherits([NotNull] ElanParser.InheritsContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.inherits"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitInherits([NotNull] ElanParser.InheritsContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.constructor"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterConstructor([NotNull] ElanParser.ConstructorContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.constructor"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitConstructor([NotNull] ElanParser.ConstructorContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.property"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterProperty([NotNull] ElanParser.PropertyContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.property"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitProperty([NotNull] ElanParser.PropertyContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.expression"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterExpression([NotNull] ElanParser.ExpressionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.expression"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitExpression([NotNull] ElanParser.ExpressionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.term"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterTerm([NotNull] ElanParser.TermContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.term"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitTerm([NotNull] ElanParser.TermContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.bracketedExpression"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterBracketedExpression([NotNull] ElanParser.BracketedExpressionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.bracketedExpression"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitBracketedExpression([NotNull] ElanParser.BracketedExpressionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.lambda"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLambda([NotNull] ElanParser.LambdaContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.lambda"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLambda([NotNull] ElanParser.LambdaContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.ifExpression"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterIfExpression([NotNull] ElanParser.IfExpressionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.ifExpression"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitIfExpression([NotNull] ElanParser.IfExpressionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.newInstance"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterNewInstance([NotNull] ElanParser.NewInstanceContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.newInstance"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitNewInstance([NotNull] ElanParser.NewInstanceContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.unaryOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterUnaryOp([NotNull] ElanParser.UnaryOpContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.unaryOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitUnaryOp([NotNull] ElanParser.UnaryOpContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.varRef"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterVarRef([NotNull] ElanParser.VarRefContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.varRef"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitVarRef([NotNull] ElanParser.VarRefContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.defaultType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterDefaultType([NotNull] ElanParser.DefaultTypeContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.defaultType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitDefaultType([NotNull] ElanParser.DefaultTypeContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.index"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterIndex([NotNull] ElanParser.IndexContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.index"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitIndex([NotNull] ElanParser.IndexContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.range"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterRange([NotNull] ElanParser.RangeContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.range"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitRange([NotNull] ElanParser.RangeContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.withClause"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterWithClause([NotNull] ElanParser.WithClauseContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.withClause"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitWithClause([NotNull] ElanParser.WithClauseContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.inlineAsignment"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterInlineAsignment([NotNull] ElanParser.InlineAsignmentContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.inlineAsignment"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitInlineAsignment([NotNull] ElanParser.InlineAsignmentContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.literal"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLiteral([NotNull] ElanParser.LiteralContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.literal"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLiteral([NotNull] ElanParser.LiteralContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.literalValue"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLiteralValue([NotNull] ElanParser.LiteralValueContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.literalValue"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLiteralValue([NotNull] ElanParser.LiteralValueContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.enumValue"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterEnumValue([NotNull] ElanParser.EnumValueContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.enumValue"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitEnumValue([NotNull] ElanParser.EnumValueContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.literalDataStructure"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLiteralDataStructure([NotNull] ElanParser.LiteralDataStructureContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.literalDataStructure"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLiteralDataStructure([NotNull] ElanParser.LiteralDataStructureContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.literalTuple"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLiteralTuple([NotNull] ElanParser.LiteralTupleContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.literalTuple"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLiteralTuple([NotNull] ElanParser.LiteralTupleContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.dataStructureDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterDataStructureDefinition([NotNull] ElanParser.DataStructureDefinitionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.dataStructureDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitDataStructureDefinition([NotNull] ElanParser.DataStructureDefinitionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.listDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterListDefinition([NotNull] ElanParser.ListDefinitionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.listDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitListDefinition([NotNull] ElanParser.ListDefinitionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.tupleDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterTupleDefinition([NotNull] ElanParser.TupleDefinitionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.tupleDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitTupleDefinition([NotNull] ElanParser.TupleDefinitionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.dictionaryDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterDictionaryDefinition([NotNull] ElanParser.DictionaryDefinitionContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.dictionaryDefinition"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitDictionaryDefinition([NotNull] ElanParser.DictionaryDefinitionContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.kvp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterKvp([NotNull] ElanParser.KvpContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.kvp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitKvp([NotNull] ElanParser.KvpContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.literalList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLiteralList([NotNull] ElanParser.LiteralListContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.literalList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLiteralList([NotNull] ElanParser.LiteralListContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.literalDictionary"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLiteralDictionary([NotNull] ElanParser.LiteralDictionaryContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.literalDictionary"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLiteralDictionary([NotNull] ElanParser.LiteralDictionaryContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.literalKvp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLiteralKvp([NotNull] ElanParser.LiteralKvpContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.literalKvp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLiteralKvp([NotNull] ElanParser.LiteralKvpContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.deconstructedTuple"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterDeconstructedTuple([NotNull] ElanParser.DeconstructedTupleContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.deconstructedTuple"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitDeconstructedTuple([NotNull] ElanParser.DeconstructedTupleContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.deconstructedList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterDeconstructedList([NotNull] ElanParser.DeconstructedListContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.deconstructedList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitDeconstructedList([NotNull] ElanParser.DeconstructedListContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.binaryOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterBinaryOp([NotNull] ElanParser.BinaryOpContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.binaryOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitBinaryOp([NotNull] ElanParser.BinaryOpContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.arithmeticOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterArithmeticOp([NotNull] ElanParser.ArithmeticOpContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.arithmeticOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitArithmeticOp([NotNull] ElanParser.ArithmeticOpContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.logicalOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterLogicalOp([NotNull] ElanParser.LogicalOpContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.logicalOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitLogicalOp([NotNull] ElanParser.LogicalOpContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.conditionalOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterConditionalOp([NotNull] ElanParser.ConditionalOpContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.conditionalOp"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitConditionalOp([NotNull] ElanParser.ConditionalOpContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.type"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterType([NotNull] ElanParser.TypeContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.type"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitType([NotNull] ElanParser.TypeContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.dataStructureType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterDataStructureType([NotNull] ElanParser.DataStructureTypeContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.dataStructureType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitDataStructureType([NotNull] ElanParser.DataStructureTypeContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.genericSpecifier"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterGenericSpecifier([NotNull] ElanParser.GenericSpecifierContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.genericSpecifier"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitGenericSpecifier([NotNull] ElanParser.GenericSpecifierContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.tupleType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterTupleType([NotNull] ElanParser.TupleTypeContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.tupleType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitTupleType([NotNull] ElanParser.TupleTypeContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.typeList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterTypeList([NotNull] ElanParser.TypeListContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.typeList"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitTypeList([NotNull] ElanParser.TypeListContext context);
	/// <summary>
	/// Enter a parse tree produced by <see cref="ElanParser.funcType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void EnterFuncType([NotNull] ElanParser.FuncTypeContext context);
	/// <summary>
	/// Exit a parse tree produced by <see cref="ElanParser.funcType"/>.
	/// </summary>
	/// <param name="context">The parse tree.</param>
	void ExitFuncType([NotNull] ElanParser.FuncTypeContext context);
}
