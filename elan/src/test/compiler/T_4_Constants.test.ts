import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import {
  assertDoesNotCompile,
  assertDoesNotParse,
  assertObjectCodeExecutes,
  assertObjectCodeIs,
  assertParses,
  assertStatusIsValid,
  testHash,
  transforms,
} from "./compiler-test-helpers";

suite("T_4_Constants", () => {
  test("Pass_Int", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 3
main
  print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = 3;

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    //const symbols not yet implemented
    //const varConst = fileImpl.getChildFloat(0);
    //assertIsSymbol(varConst, "a", "Int");
    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  test("Pass_Int_Hex", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 0xFF
main
  
  print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = 255;

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "255");
  });

  test("Pass_Int_Binary", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 0b10101
main
  print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = 21;

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "21");
  });

  test("Pass_Float", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 3.1
main
print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = 3.1;

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3.1");
  });

  test("Pass_String", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to "hell0"
main
print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = "hell0";

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "hell0");
  });

  test("Pass_EmptyString", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to ""
main
  print a
  print a is empty String
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = "";

async function main() {
  system.print(_stdlib.asString(a));
  system.print(_stdlib.asString(a === ""));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "true");
  });

  test("Pass_SpaceAsString", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to " "
main
  print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = " ";

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, " ");
  });

  test("Pass_Bool", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to true
main
  print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = true;

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "true");
  });

  test("Pass_Enum", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to Fruit.apple
main
  print a
end main
enum Fruit
  apple, orange, pear
end enum
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
var Fruit = {
  _default : "apple", apple : "apple", orange : "orange", pear : "pear"
};

const a = Fruit.apple;

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "apple");
  });

  test("Pass_List", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to {1,2,3}
main
  print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = system.immutableList([1, 2, 3]);

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "ImmutableList {1, 2, 3}");
  });

  test("Fail_ArrayList", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to [1,2,3]
main
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test("Fail_Dictionary", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to ["a":1]
main
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test("Pass_ListofList", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to {{4, 5}, {6, 7, 8}}
main
  print a
end main
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = system.immutableList([system.immutableList([4, 5]), system.immutableList([6, 7, 8])]);

async function main() {
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(
      fileImpl,
      "ImmutableList {ImmutableList {4, 5}, ImmutableList {6, 7, 8}}",
    );
  });

  test("Fail_useInsideMain", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  constant a set to 3 
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test("Fail_incorrectKeyword", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

const a set to 3

main
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test("Fail_invalidLiteralString", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 'hello'

main 
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test("Fail_reassignment", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 3

main
  set a to 4
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["May not mutate constant"]);
  });

  test("Fail_expression", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 3 + 4

main
  set a to 4 
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  test("Pass_referenceToOtherConstant", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 3
constant b set to a

main
  print b
end main
`;
    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
const a = 3;

const b = a;

async function main() {
  system.print(_stdlib.asString(b));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    //const symbols not yet implemented
    //const varConst = fileImpl.getChildFloat(0);
    //assertIsSymbol(varConst, "a", "Int");
    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  test("Fail_UseOfKeywordAsName", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant if set to 3

main

end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["'if' keyword may not be used as identifier"]);
  });

  test("Fail_NotUniqueName", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to 1
constant a set to 2
main
  
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertDoesNotCompile(fileImpl, ["Name a not unique in scope"]);
  });
});
