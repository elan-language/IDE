import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeDoesNotExecute, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";
import { createHash } from "node:crypto";

suite('T28_Expressions2_Brackets', () => {

  test('Pass_BracketsChangeOperatorEvaluation', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var x set to 2 + 3 * 5 + 1
  var y set to (2 + 3) * 5 + 1
  var z set to (2 + 3) * (5 + 1)
  print x
  print y
  print z
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var x = 2 + 3 * 5 + 1;
  var y = (2 + 3) * 5 + 1;
  var z = (2 + 3) * (5 + 1);
  system.print(system.asString(x));
  system.print(system.asString(y));
  system.print(system.asString(z));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "182630");
  });

  test('Pass_RedundantBracketsIgnored', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

    main
    var x set to 2 + (3 * 5) + 1
    var y set to ((2 + 3)) * 5 + (1)
    var z set to ((2 + 3) * (5 + 1))
    print x
    print y
    print z
  end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var x = 2 + (3 * 5) + 1;
  var y = ((2 + 3)) * 5 + (1);
  var z = ((2 + 3) * (5 + 1));
  system.print(system.asString(x));
  system.print(system.asString(y));
  system.print(system.asString(z));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "182630");
  });

  test('Pass_PowerHasHigherPrecedenceThatMultiply', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var x set to 2 + 3 ^ 2
  var y set to (2 + 3) ^ 2
  print x
  print y
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var x = 2 + 3 ** 2;
  var y = (2 + 3) ** 2;
  system.print(system.asString(x));
  system.print(system.asString(y));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "1125");
  });

 

  // TODO fails

});