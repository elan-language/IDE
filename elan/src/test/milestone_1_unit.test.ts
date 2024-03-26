import * as vscode from 'vscode';
import { T03_mainWithAllStatements, T04_allGlobalsExceptClass, T09_emptyMainAndClassWithGlobalSelector } from './milestone_1.functions.';
import { assertClasses, assertElementHasClasses, key } from './testHelpers';
import { isParent } from '../frames/helpers';
import assert from 'assert';
import { FileImpl } from '../frames/file-impl';
import { Class } from '../frames/globals/class';
import { MemberSelector } from '../frames/class-members/member-selector';
import { MainFrame } from '../frames/globals/main-frame';
import { Function } from '../frames/globals/function';
import { StatementSelector } from '../frames/statements/statement-selector';
import { GlobalSelector } from '../frames/globals/global-selector';
import { Switch } from '../frames/statements/switch';
import { IfStatement } from '../frames/statements/if-statement';
import { While } from '../frames/statements/while';
import { FunctionMethod } from '../frames/class-members/function-method';
import { hash } from '../util';
import { DefaultProfile } from '../frames/default-profile';

suite('Milestone 1 - Unit tests', () => {
	vscode.window.showInformationMessage('Start all unit tests.');

	test('Selectable Select', () => {
		assertClasses(
			T04_allGlobalsExceptClass,
			(ff) => {
				const frame = ff.getById("const1");
				frame.select(true, false);
			},
			["const1", "valid", "selected focused valid"]);

	});

	test('Select First Child', () => {
		assertClasses(
			T04_allGlobalsExceptClass,
			(ff) => {
				const mn = ff.getById("main4");
				if (isParent(mn)){
					const s = mn.getFirstChild();
					s.select(true, false);
				}
			},
			["select5", "valid empty", "selected focused valid empty"]);
	});

	test('Collapse Main', () => {
		assertClasses(
			T04_allGlobalsExceptClass,
			(ff) => {
				const mn = ff.getById("main4");
				if (isParent(mn)){
					mn.collapse();
				}
			},
			["main4", "valid multiline", "collapsed valid multiline"]);
	});

	test('Invalid identifier', () => {
		var file = T03_mainWithAllStatements();
		assertElementHasClasses(file, "fileStatus", "incomplete");
		assertElementHasClasses(file, "var3", "incomplete"); 
		file.getById("var4").processKey(key("X"));
		assertElementHasClasses(file, "var3", "invalid");
		assertElementHasClasses(file, "fileStatus", "invalid");
	});

	test('Valid identifier', () => {
		var file = T03_mainWithAllStatements();
		assertElementHasClasses(file, "fileStatus", "incomplete");
		assertElementHasClasses(file, "var3", "incomplete"); 
		file.getById("var4").processKey(key("q"));
		assertElementHasClasses(file, "var4", "valid");
		assertElementHasClasses(file, "fileStatus", "incomplete"); //Because there are other incomplete fields
	});

	test('Valid variable statement', () => {
		var file = T03_mainWithAllStatements();
		assertElementHasClasses(file, "fileStatus", "incomplete");
		assertElementHasClasses(file, "var3", "incomplete"); 
		file.getById("var4").processKey(key("q"));
		file.getById("expr5").processKey(key("5"));
		assertElementHasClasses(file, "var3", "valid");
	});

	test("Statement Select - variable", () => {
		var file = T09_emptyMainAndClassWithGlobalSelector();
		file.getById("select2").processKey(key("v"));
		var v = file.getById("var12").renderAsSource();
		assert.equal(v, '  var  set to ');
	});	
	
	test("Member Select - function", () => {
		var file = T09_emptyMainAndClassWithGlobalSelector();
		file.getById("select11").processKey(key("f"));
		var v = file.getById("func12").renderAsSource();
		assert.equal(v, '  function () return \r\n' +
		'    return result\r\n' +
		'  end function\r\n');
 	});	

	 test("Member Select - procedure", () => {
		var file = T09_emptyMainAndClassWithGlobalSelector();
		file.getById("select11").processKey(key("p"));
		file.getById("select11").processKey(key("c"));
		var v = file.getById("proc12").renderAsSource();
		assert.equal(v, '  procedure ()\r\n\r\n  end procedure\r\n');
 	});	

	 test("Global Select - Constant", () => {
		var file = T09_emptyMainAndClassWithGlobalSelector();
		file.getById("select0").processKey(key("c"));
		file.getById("select0").processKey(key("o"));
		var v = file.getById("const12").renderAsSource();
		assert.equal(v, 'constant  set to \r\n');
 	});	

	 test("Selection Filtering - globals", () => {
		const f = new FileImpl(hash, new DefaultProfile());
		var g = new GlobalSelector(f);
		var help = g.getHelp();
		assert.equal(help, " main procedure function class constant enum test #");
		g.processKey(key('c'));
		help = g.getHelp();
		assert.equal(help, " class constant");
        assert.equal(g.renderAsHtml(), `<global class="valid" id='select1' tabindex="0"><selector><text>c</text><placeholder>new code</placeholder><help class="selector"> class constant</help></selector></global>`);
	});	

	test("Selection Filtering - members", () => {
		const f = new FileImpl(hash, new DefaultProfile());
		var c = new Class(f);		
		var s = new MemberSelector(c);
		var help = s.getHelp();
		assert.equal(help, " function procedure property #");
		s.processKey(key('p'));
		assert.equal(s.text, "pro");
		help = s.getHelp();
		assert.equal(help, " procedure property");
        assert.equal(s.renderAsHtml(), `<member class="valid" id='select10' tabindex="0"><selector><text>pro</text><placeholder>new code</placeholder><help class="selector"> procedure property</help></selector></member>`);
	});	

	test("Selection Filtering - abstract class", () => {
		const f = new FileImpl(hash, new DefaultProfile());
		var c = new Class(f);
		c.makeAbstract();		
		var s = new MemberSelector(c);
		assert.equal(s.getHelp(), " abstract function, abstract procedure, abstract property, #");
		s.processKey(key('a'));
		assert.equal(s.text, "abstract ");
		assert.equal(s.getHelp(), " abstract function, abstract procedure, abstract property,");
		s.processKey(key('a'));
		assert.equal(s.text, "abstract ");
		s.processKey(key('b'));
		assert.equal(s.text, "abstract ");
		assert.equal(s.getHelp(), " abstract function, abstract procedure, abstract property,");
		s.processKey(key('p'));
		assert.equal(s.text, "abstract pro");
		assert.equal(s.getHelp(), " abstract procedure, abstract property,");
        assert.equal(s.renderAsHtml(), `<member class="valid" id='select10' tabindex="0"><selector><text>abstract pro</text><placeholder>new code</placeholder><help class="selector"> abstract procedure, abstract property,</help></selector></member>`);
	});	

	test("Selection Filtering - statements", () => {
		const f = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(f);		
		var s = new StatementSelector(m);
		var help = s.getHelp();
		assert.equal(help, " call each external for if input print repeat set switch throw try var while #");
		s.processKey(key('s'));
		help = s.getHelp();
		assert.equal(help, " set switch");
        assert.equal(s.renderAsHtml(), `<statement class="valid" id='select3' tabindex="0"><selector><text>s</text><placeholder>new code</placeholder><help class="selector"> set switch</help></selector></statement>`);
	});	

	test("Selection Context - in a Function", () => {
		const fl = new FileImpl(hash, new DefaultProfile());
		var func = new Function(fl);		
		var s = new StatementSelector(func);
		var help = s.getHelp();
		assert.equal(help, " each for if repeat set switch throw try var while #");
	});	

	test("Selection Context - deeper nesting 1", () => {
		const fl = new FileImpl(hash, new DefaultProfile());
		var func = new Function(fl);
		var if1 = new IfStatement(func);
        var wh = new While(if1);
		var s = new StatementSelector(wh);
		var help = s.getHelp();
		assert.equal(help, " each for if repeat set switch throw try var while #");//no else, print, call
	});	

	test("Selection Context - deeper nesting 2", () => {
		const fl = new FileImpl(hash, new DefaultProfile());
		var c = new Class(fl);
        var fm = new FunctionMethod(c);
		var if1 = new IfStatement(fm);
		var s = new StatementSelector(if1);
		var help = s.getHelp();
		assert.equal(help, " each else for if repeat set switch throw try var while #");//else, but no print, call
	});	

	test("Selection Context - in a Switch", () => {
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var sw = new Switch(m);
		var s = new StatementSelector(sw);
		var help = s.getHelp();
		assert.equal(help, " case");
	});	
	test("Selection Context - in an IfThen", () => {
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var ifThen = new IfStatement(m);
		var s = new StatementSelector(ifThen);
		var help = s.getHelp();
		assert.equal(help, " call each else external for if input print repeat set switch throw try var while #");
		s.processKey(key('e'));
		help = s.getHelp();
		assert.equal(help, " each else external");
	});	
	test("Selection Context - selector prevents more than one main", () => {
		const fl = new FileImpl(hash, new DefaultProfile());
		var gs = new GlobalSelector(fl);
		var help = gs.getHelp();
		assert.equal(help, " main procedure function class constant enum test #");
		var m = new MainFrame(fl);	
		fl.getChildren().push(m);
		gs = new GlobalSelector(fl);
		help = gs.getHelp();
		assert.equal(help, " procedure function class constant enum test #");
	});	
});	

