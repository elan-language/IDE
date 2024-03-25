import assert from "assert";
import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { MainFrame } from "../../frames/globals/main-frame";
import { ISymbol } from "../../symbols/ISymbol";
import { isSymbol } from "../../symbols/symbolHelpers";
import { assertDoesNotParse, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";

suite('T_5_Variables', () => {

  test('Pass_Int', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  print a
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3;
  system.print(system.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    var varDef = (fileImpl.getChildNumber(0) as MainFrame).getChildren()[0];

    if (isSymbol(varDef)) {
      var sid = varDef.symbolId;
      var st = varDef.symbolType;

      assert.strictEqual(sid, 'a');
      assert.strictEqual(st?.name, 'Int');
    }

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  test('Pass_IntVariable', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  var b set to a
  print b
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3;
  var b = a;
  system.print(system.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));


    var varDef = (fileImpl.getChildNumber(0) as MainFrame).getChildren()[1];

    if (isSymbol(varDef)) {
      var sid = varDef.symbolId;
      var st = varDef.symbolType;

      assert.strictEqual(sid, 'b');
      assert.strictEqual(st?.name, 'Int');
    }



    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  test('Pass_Int_Expression', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3 + 4
  print a
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3 + 4;
  system.print(system.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "7");
  });

  test('Pass_Reassign', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  set a to 4
  print a
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3;
  a = 4;
  system.print(system.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "4");
  });

  test('Pass_CoerceFloatToIntVar', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3.1
  set a to 4
  print a
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3.1;
  a = 4;
  system.print(system.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "4");
  });

  test('Pass_LocalVarHidesGlobalConstant', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 3
main
  var a set to 4
  print a
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
const a = 3;

export async function main() {
  var a = 4;
  system.print(system.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "4");
  });

  ignore_test('Pass_OperatorCoverage', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3 - 4
  var b set to 3 < 4
  var c set to 3 <= 4
  var d set to 3 > 4
  var e set to 3 >= 4
  var f set to 3 is 4
  var g set to 3 is not 4
  var h set to not false
  print a
  print b
  print c
  print d
  print e
  print f
  print g
  print h
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3 - 4;
  var b = 3 < 4;
  var c = 3 <= 4;
  var d = 3 > 4;
  var e = 3 >= 4;
  var f = 3 is 4;
  var g = 3 is not 4;
  var h = not false;
  system.print(system.asString(a));
  system.print(system.asString(b));
  system.print(system.asString(c));
  system.print(system.asString(d));
  system.print(system.asString(e));
  system.print(system.asString(f));
  system.print(system.asString(g));
  system.print(system.asString(h));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "4");
  });

  ignore_test('Pass_Enum', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to Fruit.apple
  print a
end main
enum Fruit
  apple, orange, pear
end enum`;

    const objectCode = `var system; export function _inject(l) { system = l; };
enum Fruit {
    apple = "apple", orange = "orange", pear = "pear"
}

export async function main() {
  var a = Fruit.apple;
  system.print(system.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "apple");
  });

  test('Fail_WrongKeyword', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  variable a set to 3
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_DuplicateVar', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  var a set to 4
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_GlobalVariable', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

var a set to 4
main
 
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_AssignIncompatibleType', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 4
  set a to 4.1
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_NotInitialized', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a
  set a to 4.1
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_InvalidVariableName1', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var A = 4.1
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_InvalidVariableName2', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a@b set to 4.1
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_UseOfKeywordAsName', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var if set to 4.1
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);

  });
});