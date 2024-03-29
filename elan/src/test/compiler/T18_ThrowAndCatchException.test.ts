import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeDoesNotExecute, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";
import { createHash } from "node:crypto";

suite('T18_ThrowAndCatchException', () => {

  test('Pass_ThrowExceptionInMain', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    throw "Foo"
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  throw new Error("Foo");
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeDoesNotExecute(fileImpl, "Foo");
  });

  test('Pass_ThrowExceptionInMainUsingVariableForMessage', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var msg set to "Foo"
  throw msg
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var msg = "Foo";
  throw new Error(msg);
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeDoesNotExecute(fileImpl, "Foo");
  });

  ignore_test('Pass_ThrowExceptionUsingInterpolatedStringForMessage', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var bar set to 1
  throw "{bar}"
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var bar = 1;
  throw new Error("{bar}");
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeDoesNotExecute(fileImpl, "1");
  });

  test('Pass_ThrowExceptionInProcedure', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  call foo()
end main
 
procedure foo()
  throw "Foo"
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  foo();
}

function foo() {
  throw new Error("Foo");
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeDoesNotExecute(fileImpl, "Foo");
  });

  ignore_test('Pass_CatchException', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  try
    call foo()
    print "not caught"
  catch e
    print e
  end try
end main
  
procedure foo()
  throw "Foo"
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  try
    foo()
    print "not caught";
  catch (_e) {
    var e = _e as Error;
    system.print(system.asString(e));
  }
}

function foo() {
  throw new Error("Foo");
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeDoesNotExecute(fileImpl, "Foo");
  });

  ignore_test('Pass_CatchSystemGeneratedException', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  try
    var x set to 1
    var y set to 0
    var z set to x div y
    print "not caught";
  catch e
    print e
  end try
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  try {
    var x = 1;
    var y = 0;
    var z = x / y;
    system.print(system.asString("not caught"));
  }
  catch (_e) {
    var e = _e as Error;
    system.print(system.asString(e));
  }
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeDoesNotExecute(fileImpl, "Foo");
  });

  ignore_test('Pass_UseException', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  try
    call foo()
    print ""not caught""
  catch e
    print e.message
  end try
end main
  
procedure foo()
  throw "Foo"
end procedure`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  try
    foo()
    print "not caught";
  catch (_e) {
    var e = _e as Error;
    system.print(system.asString(e));
  }
}

function foo() {
  throw new Error("Foo");
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeDoesNotExecute(fileImpl, "Foo");
  });

  ignore_test('Fail_ThrowExceptionInFunction', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var s set to foo("s")
end main
 
function foo(x String) as String
  throw x
  return x
end function
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_catchMissingVariable', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  try
    call foo()
    print "not caught"
  catch
    print "caught"
  end try
end main
  
procedure foo()
  throw "Foo"
end procedure
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_UseExpressionForMessage', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var msg set to "Foo"
  throw msg + bar
end main
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });
});