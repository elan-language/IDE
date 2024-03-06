import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";

suite('T_6_ArithmeticOperators', () => {

  test('Pass_IntAddition', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 3 + 4
end main`;

    const objectCode = `var system : any; export function _inject(l : any) { system = l; };
export async function main() {
  system.print(system.asString(3 + 4));
}
`;

    const fileImpl = new FileImpl(() => "", true);
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

    const objectCode = `var system : any; export function _inject(l : any) { system = l; };
export async function main() {
  system.print(system.asString(3 - 4));
}
`;

    const fileImpl = new FileImpl(() => "", true);
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

    const objectCode = `var system : any; export function _inject(l : any) { system = l; };
export async function main() {
  system.print(system.asString(3 * 4));
}
`;

    const fileImpl = new FileImpl(() => "", true);
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

    const objectCode = `var system : any; export function _inject(l : any) { system = l; };
export async function main() {
  var a = 3;
  system.print(system.asString(a + 4));
}
`;

    const fileImpl = new FileImpl(() => "", true);
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

    const objectCode = `var system : any; export function _inject(l : any) { system = l; };
export async function main() {
  system.print(system.asString(3 / 2));
}
`;

    const fileImpl = new FileImpl(() => "", true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1.5");
  });

  ignore_test('Pass_IntegerDivision', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 7 div 2
end main`;

    const objectCode = `var system : any; export function _inject(l : any) { system = l; };
export async function main() {
  system.print(system.asString(7 div 2));
}
`;

    const fileImpl = new FileImpl(() => "", true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  ignore_test('Pass_Mod', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 11 mod 3
end main`;

    const objectCode = `var system : any; export function _inject(l : any) { system = l; };
export async function main() {
  system.print(system.asString(11 mod 3));
}
`;

    const fileImpl = new FileImpl(() => "", true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "2");
  });

});