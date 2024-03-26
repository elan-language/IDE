import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeDoesNotExecute, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";
import { createHash } from "node:crypto";

suite('T19_Procedures', () => {

  test('Pass_BasicOperationIncludingPrint', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 1
  call foo()
  print 3
end main

procedure foo()
  print 2
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(1));
  foo();
  system.print(system.asString(3));
}

function foo() {
  system.print(system.asString(2));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "123");
  });

  ignore_test('Pass_GlobalProcedureOnClass', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var b set to new Bar()
  call b.foo()
end main

procedure foo(bar Bar)
    print bar
end procedure

class Bar
    constructor()
    end constructor

    function asString() as String
        return "bar"
    end function

end class`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var b = new Bar();
  b.foo();
}

function foo(bar: Bar) {
  system.print(system.asString(bar));
}

class Bar {
  constructor() {

  }

  asString() : string {
    return "bar";
  }

}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "bar");
  });

  ignore_test('Pass_ExternalCall', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  external pause(1)
  print 1
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.pause(1);
  system.print(system.asString(1));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1");
  });

  ignore_test('Pass_WithParamsPassingVariables', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 2
  var b set to "hello"
  call foo(a, b)
end main

procedure foo(a Int, b String)
    print a
    print b
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 2;
  var b = "hello";
  foo(a, b);
}

function foo(a: number, b: string) {
  system.print(system.asString(a));
  system.print(system.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1");
  });

  ignore_test('Pass_WithParamsPassingRefVariables', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 2
  var b set to "hello"
  call foo(a, b)
end main

procedure foo(out a Int, out b String)
    print a
    print b
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 2;
  var b = "hello";
  foo(a, b);
}

function foo(a: number, b: string) {
  system.print(system.asString(a));
  system.print(system.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1");
  });

  ignore_test('Pass_WithMixedRefParams', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 2
  var b set to "hello"
  call foo(a, b)
end main

procedure foo(a Int, out b String)
    print a
    print b
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 2;
  var b = "hello";
  foo(a, b);
}

function foo(a: number, b: string) {
  system.print(system.asString(a));
  system.print(system.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1");
  });

  ignore_test('Pass_CallingWithDotSyntax', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 2
  var b set to ""hello""
  call a.foo(b)
end main

procedure foo(a Int, b String)
  print a
  print b
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 2;
  var b = "hello";
  foo(a, b);
}

function foo(a: number, b: string) {
  system.print(system.asString(a));
  system.print(system.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1");
  });

  ignore_test('Pass_WithParamsPassingLiteralsOrExpressions', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 1
  call foo(a + 1, ""hello"")
end main

procedure foo(a Int, b String)
  print a
  print b
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 1;
  foo(a + 1, "hello);
}

function foo(a: number, b: string) {
  system.print(system.asString(a));
  system.print(system.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1");
  });

  ignore_test('Pass_RefParamsCanBeUpdated', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 1
  var b set to ""hello""
  call foo(a, b)
  print a
  print b
end main

procedure foo (out a Int, out b String)
  set a to a + 1
  set b to b + "!"
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 1;
  var b = "hello";
  foo(a, b);
  system.print(system.asString(a));
  system.print(system.asString(b));
}

function foo(a: number, b: string) {
  a = a + 1;
  b = b + "!";
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1");
  });

  test('Pass_NestedCalls', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call foo()
  print 3
end main

procedure foo()
  print 1
  call bar()
end procedure

procedure bar()
  print 2
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  foo();
  system.print(system.asString(3));
}

function foo() {
  system.print(system.asString(1));
  bar();
}

function bar() {
  system.print(system.asString(2));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "123");
  });

  ignore_test('Pass_Recursion', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call foo(3)
end main

procedure foo(a Int)
  if a > 0
    print a
    var b set to a - 1
    call foo(b)
  end if
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  foo(3);
}

function foo(a: number) {
  if (a > 0) {
    system.print(system.asString(a));
    var b = a - 1;
    foo(b);
  }
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "123");
  });
 
  ignore_test('Fail_CallingUndeclaredProc', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call bar()
end main
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_TypeSpecifiedBeforeParamName', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
end main
    
procedure foo(Int a) 
  print a
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));
    assertDoesNotParse(fileImpl);
  });

  test('Fail_NoEnd', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 1
  call foo()
  print 3
end main

procedure foo()
    print 2
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_CannotCallMain', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 1
  call foo()
  print 3
end main

procedure foo()
  call main()
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_PassingUnnecessaryParameter', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 1
  call foo(3)
  print 3
end main

procedure foo()
  print 2
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_PassingTooFewParams', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 1
  call foo(a + 1)
end main

procedure foo (a Int, b String)
  print a
  print b
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_PassingWrongType', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call foo(1,2)
end main

procedure foo (a Int, b String)
  print a
  print b
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_InclusionOfOutInCall', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call foo(out 1,2)
end main

procedure foo(a Int, b String)
  print a
  print b
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_InclusionOfRefInDefinition', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call foo(byref 1,2)
end main

procedure foo(ref a Int, b String)
  print a
  print b
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_UnterminatedRecursion', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call foo(3)
end main

procedure foo(a Int)
  call foo(a)
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_CannotCallPrintAsAProcedure', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call print(""Hello World!"")
end main
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_NonRefParamsCannotBeUpdated', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 1
  var b set to ""hello""
  call foo(a, b)
  print a
  print b
end main

procedure foo (out a Int, b String)
  set a to a + 1
  set b to b + ""!""
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_RefKeywordMayNotBeAddedToArgument', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 1
  var b set to ""hello""
  call foo(ref a, b)
  print a
  print b
end main

procedure foo (ref a Int, b String)
  set a to a + 1
  set b to b + ""!""
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_WithParamsPassingRefLiteral', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 2
  var b set to ""hello""
  call foo(a, ""hello"")
end main

procedure foo(out a Int, out b String)
  print a
  print b
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

});