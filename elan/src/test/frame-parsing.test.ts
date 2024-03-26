import assert from 'assert';
import * as vscode from 'vscode';
import {CodeSourceFromString } from '../frames/code-source';
import { FileImpl } from '../frames/file-impl';
import { MainFrame } from '../frames/globals/main-frame';
import { SetStatement } from '../frames/statements/set-statement';
import { StatementSelector } from '../frames/statements/statement-selector';
import { VariableDefStatement } from '../frames/statements/variable-def-statement';
import { Print } from '../frames/statements/print';
import { Throw } from '../frames/statements/throw';
import { Call } from '../frames/statements/call';
import { assertFileParses } from './testHelpers';
import { hash } from '../util';
import { DefaultProfile } from '../frames/default-profile';

suite('File Parsing Tests', () => {
	vscode.window.showInformationMessage('Start all unit tests.');

	test('code source - readToNonMatchingCloseBracket1', () => {
		var source = new CodeSourceFromString("foo, bar, yon) ");
		var read = source.readToNonMatchingCloseBracket();
		assert.equal(read, "foo, bar, yon");
		assert.equal(source.getRemainingCode(), ") ");
	});
	test('code source - readToNonMatchingCloseBracket2', () => {
		var source = new CodeSourceFromString(`"x)y" ) `);
		var read = source.readToNonMatchingCloseBracket();
		assert.equal(read, `"x)y" `);
		assert.equal(source.getRemainingCode(), ") ");
	});
	test('code source - readToNonMatchingCloseBracket3', () => {
		var source = new CodeSourceFromString(`x() ) `);
		var read = source.readToNonMatchingCloseBracket();
		assert.equal(read, `x() `);
		assert.equal(source.getRemainingCode(), ") ");
	});

	test('parse Frames - empty file', () => {
        var source = new CodeSourceFromString("");
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		var code = `# c86776f84624ecbc12d2eef7883c0a525c2c11b6ddcab8a3010430a7580c1ab3 Elan v0.1 valid

`;
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	}); 

    test('parse Frames - set statement', () => {
		var code = "  set fooBar to 3.141";
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var setTo = new SetStatement(m);
		setTo.parseFrom(source);
		assert.equal(source.hasMoreCode(), false);
		assert.equal(setTo.renderAsSource(), code);
	}); 

	test('parse Frames - variable', () => {
		var code = "  var fooBar set to 3.141";
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var v = new VariableDefStatement(m);
		v.parseFrom(source);
		assert.equal(source.hasMoreCode(), false);
		assert.equal(v.renderAsSource(), code);
	});

	test('parse Frames - print', () => {
		var code = `  print "Hello World!"`;
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var p = new Print(m);
		p.parseFrom(source);
		assert.equal(source.hasMoreCode(), false);
		assert.equal(p.renderAsSource(), code);
	});
	test('parse Frames - throw', () => {
		var code = `  throw "Failure"`;
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var setTo = new Throw(m);
		setTo.parseFrom(source);
		assert.equal(source.hasMoreCode(), false);
		assert.equal(setTo.renderAsSource(), code);
	});
	test('parse Frames - throw with variable', () => {
		var code = `  throw message1`;
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var setTo = new Throw(m);
		setTo.parseFrom(source);
		assert.equal(source.hasMoreCode(), false);
		assert.equal(setTo.renderAsSource(), code);
	});
	test('parse Frames - call', () => {
		var code = `  call foo()`;
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var setTo = new Call(m);
		setTo.parseFrom(source);
		assert.equal(source.hasMoreCode(), false);
		assert.equal(setTo.renderAsSource(), code);
	});
	test('parse Frames - call with args', () => {
		var code = `  call foo(3, a, "hello")`;
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var setTo = new Call(m);
		setTo.parseFrom(source);
		assert.equal(source.hasMoreCode(), false);
		assert.equal(setTo.renderAsSource(), code);
	});
	test('parse Frames - StatementSelector', () => {
		var code = "set fooBar to 3.141";
        var source = new CodeSourceFromString(code + "\n");
		const fl = new FileImpl(hash, new DefaultProfile());
		var m = new MainFrame(fl);	
		var ss = new StatementSelector(m);
		ss.parseFrom(source);
		assert.equal(source.getRemainingCode(), "");
	}); 

	test('parse Frames - header file', () => {
		var code = `# c86776f84624ecbc12d2eef7883c0a525c2c11b6ddcab8a3010430a7580c1ab3 Elan v0.1 valid

`;
        var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - constant only', () => {
		var code = `# 83e1b601b037b88345a6441e68c281a520c5919d159b62b13c216ece8457ad42 Elan v0.1 valid

constant pi set to 3.142
`;
        var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});


	test('parse Frames - two constants', () => {
		var code = `# 1e1d3aa095463fa2aab8601b090744c2e670e90a5333ade81ad565f36767866a Elan v0.1 valid

constant pi set to 3.142

constant e set to 2.718
`;
        var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - main', () => {
		var code = `# 5642a0933550c6081bce260e8e0c4cf2cdf112193b0cc034980e23636a796bfc Elan v0.1 valid

main

end main
`;
        var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - hello world', () => {
		var code = `# 244696ccd30157219b43a148c6139816206b9269b1de2665cf230de346df30c3 Elan v0.1 valid

# my comment
main
  # My first program
  print "Hello World!"
end main
`;
        var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
    if (fl.parseError) {
      throw new Error(fl.parseError);
    }
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - main with all single-line statements', () => {
		var code = `# 55a316ade19e2e61cf48355ed7e92e75892157dcb631211d4080aa2649df6dfe Elan v0.1 valid

main
  var name set to value or expression
  set a to 3 + 4
  throw "message"
  call signIn(rwp, password)
  print "Hello World!"
end main
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - all globals except class', () => {
		var code = `# 8dfeafb5c3ac7b5950d3cc432937e3dce295a2186dd08ec7a8c77c8b212199d2 Elan v0.1 valid

constant phi set to 1.618

main

end main

procedure signIn(password as String)

end procedure

function hypotenuse(sideB as Float, sideC as Float) return Float
  return 0.0
end function

enum Fruit
  apple, orange, pear
end enum
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - class', () => {
		var code = `# 834c9e198f709067045ddf39de7a96f9f926021b95df792d5dc55a0bae618736 Elan v0.1 valid

class Player inherits Foo, Bar
  constructor()

  end constructor

  property score as Int

  procedure foo()
    print 1
  end procedure

  function bar() return Int
    return 1
  end function

end class
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - immutable class', () => {
		var code = `# c716652d0078c118b606b66848e0ea87e5618f5f0e9196cf41c34f8b8409ede2 Elan v0.1 valid

immutable class Card inherits Foo, Bar
  constructor()

  end constructor

  private property value as Int

end class
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - abstract class', () => {
		var code = `# a1cdd02909a58fceb0c51f3b484ef65f9d91a6c3aa587173069528231e7bd10c Elan v0.1 valid

abstract class Card
  abstract property value Int

  abstract procedure foo()

  abstract function bar() as Qux

end class
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - external', () => {
		var code = `# c6c9024aa74b80f7d1423e3d28c4318353d16034100e75d3ed1673aa76a04b2a Elan v0.1 valid

main
  external foo() into a
end main
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - external (no into)', () => {
		var code = `# 8d60cbf9747bf32d051ec9b6b3625e3accb03c91f4cebf76e9b51a7028063506 Elan v0.1 valid

main
  external foo()
end main
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

	test('parse Frames - abstract immutable class', () => {
		var code = `# 254e89bdf507e1d4e0bbddeb2b5a5c0c189c04bc3c44335818762a505869426a Elan v0.1 valid

abstract immutable class Card
  abstract property value Int

  abstract function bar() as Qux

end class
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	});

/* 	test('parse Frames - all multiline statements', () => {
		var code = `# FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF Elan v0.1 valid

main
  while newGame

  end while
  repeat

  end repeat when score > 20
  for i from 1 to 10 step 1

  end for
  each letter in "Charlie Duke"

  end each
  if y > 4

  end if
  if y > 4
    else

  end if
  if y > 4
    else if y > 10

    else

  end if
  try
    catch e

  end try
  switch a
    case 1

    default

  end switch
end main
`
		;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(hash, new DefaultProfile());
		fl.parseFrom(source);
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	}); */
	test('parse Frames - merge-sort', (done) => {
		assertFileParses(done, "programs/merge-sort.elan");
	});
	test('parse Frames - snake', (done) => {
    assertFileParses(done, "programs/snake.elan");
  });
  test('parse Frames - wordle', (done) => {
    assertFileParses(done, "programs/wordle.elan");
	});
  test('parse Frames - life', (done) => {
    assertFileParses(done, "programs/life.elan");
	});
  test('parse Frames - best-fit', (done) => {
    assertFileParses(done, "programs/best-fit.elan");
	});
  test('parse Frames - binary-search', (done) => {
    assertFileParses(done, "programs/binary-search.elan");
	});
  test('parse Frames - pathfinder', (done) => {
    assertFileParses(done, "programs/binary-search.elan");
	});

/*   test('parse Frames - temp - next test example', () => {

  var code = `# FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF Elan v0.1 valid

`;
		var source = new CodeSourceFromString(code);
		const fl = new FileImpl(true);
		fl.parseFrom(source);
    if (fl.parseError) {
      throw new Error(fl.parseError);
    }
		var elan = fl.renderAsSource();
		assert.equal(elan, code.replaceAll("\n", "\r\n"));
	}); */

});