import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { MainFrame } from "../../frames/globals/main-frame";
import { assertDoesNotParse, assertIsSymbol, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test, testHash } from "./compiler-test-helpers";

suite('T_5_Variables', () => {

  test('Pass_Int', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  print a
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = 3;
  system.print(_stdlib.asString(a));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    var varDef = (fileImpl.getChildNumber(0) as MainFrame).getChildren()[0];
    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  //Failing on the symbol - type is unknown
  test('Pass_IntVariable', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  var b set to a
  print b
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = 3;
  var b = a;
  system.print(_stdlib.asString(b));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    const varDef = (fileImpl.getChildNumber(0) as MainFrame).getChildren()[1];
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

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = 3 + 4;
  system.print(_stdlib.asString(a));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    var varDef = (fileImpl.getChildNumber(0) as MainFrame).getChildren()[0];
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

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = 3;
  a = 4;
  system.print(_stdlib.asString(a));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

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

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = 3.1;
  a = 4;
  system.print(_stdlib.asString(a));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    var varDef = (fileImpl.getChildNumber(0) as MainFrame).getChildren()[0];
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

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = 3;

async function main() {
  var a = 4;
  system.print(_stdlib.asString(a));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "4");
  });

  test('Pass_OperatorCoverage', async () => {
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
  var i set to 4 div 3
  var j set to 4 mod 3
  var k set to 4 / 3
  print a
  print b
  print c
  print d
  print e
  print f
  print g
  print h
  print i
  print j
  print k
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = 3 - 4;
  var b = 3 < 4;
  var c = 3 <= 4;
  var d = 3 > 4;
  var e = 3 >= 4;
  var f = 3 === 4;
  var g = 3 !== 4;
  var h = !false;
  var i = Math.floor(4 / 3);
  var j = 4 % 3;
  var k = 4 / 3;
  system.print(_stdlib.asString(a));
  system.print(_stdlib.asString(b));
  system.print(_stdlib.asString(c));
  system.print(_stdlib.asString(d));
  system.print(_stdlib.asString(e));
  system.print(_stdlib.asString(f));
  system.print(_stdlib.asString(g));
  system.print(_stdlib.asString(h));
  system.print(_stdlib.asString(i));
  system.print(_stdlib.asString(j));
  system.print(_stdlib.asString(k));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));
    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "-1truetruefalsefalsefalsetruetrue111.3333333333333333");
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

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
enum Fruit {
    apple = "apple", orange = "orange", pear = "pear"
}

async function main() {
  var a = Fruit.apple;
  system.print(_stdlib.asString(a));
}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "apple");
  });

  test('Fail_WrongKeyword', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  variable a set to 3
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_DuplicateVar', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  var a set to 4
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_GlobalVariable', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

var a set to 4
main
 
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_AssignIncompatibleType', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 4
  set a to 4.1
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_NotInitialized', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a
  set a to 4.1
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_InvalidVariableName1', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var A = 4.1
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_InvalidVariableName2', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a@b set to 4.1
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test('Fail_UseOfKeywordAsName', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var if set to 4.1
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);

  });
});