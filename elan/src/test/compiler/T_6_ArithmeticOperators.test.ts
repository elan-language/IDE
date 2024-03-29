import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";

suite('T_6_ArithmeticOperators', () => {

  test('Pass_IntAddition', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 3 + 4
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(3 + 4));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "7");
  });

  test('Pass_IntSubtraction', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 3 - 4
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(3 - 4));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "-1");
  });

  test('Pass_IntMultiplication', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 3 * 4
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(3 * 4));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "12");
  });

  test('Pass_IncludeVariable', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  print a + 4
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3;
  system.print(system.asString(a + 4));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "7");
  });

  test('Pass_DivideIntegersToFloat', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 3 / 2
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(3 / 2));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1.5");
  });

  test('Pass_IntegerDivision', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 7 div 2
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(Math.floor(7 / 2)));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  test('Pass_Mod', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 11 mod 3
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(11 % 3));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "2");
  });

  test('Pass_Power', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 3 ^ 3
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(3 ** 3));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "27");
  });

  test('Pass_UseVariableBothSides', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  set a to a + 1
  print a
end main`;

    const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  var a = 3;
  a = a + 1;
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

  test('Fail_InvalidExpression', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a = 3 4
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_PlusEquals', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  a += 1
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test('Fail_PlusPlus', () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 3
  a++
end main`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

});