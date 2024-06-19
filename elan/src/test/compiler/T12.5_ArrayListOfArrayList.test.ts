import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import {
  assertDoesNotCompile,
  assertDoesNotParse,
  assertObjectCodeDoesNotExecute,
  assertObjectCodeExecutes,
  assertObjectCodeIs,
  assertParses,
  assertStatusIsValid,
  ignore_test,
  testHash,
  transforms,
} from "./compiler-test-helpers";
import { createHash } from "node:crypto";

suite("T12.5_ArrayListOfArrayList", () => {
  test("Pass_literalArrayListOfArrayList", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [1,2]
  var b set to [3,4]
  var c set to [a,b]
  print c
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([1, 2]);
  var b = system.literalArray([3, 4]);
  var c = system.literalArray([a, b]);
  system.print(_stdlib.asString(c));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "ArrayList [ArrayList [1, 2], ArrayList [3, 4]]");
  });

  test("Pass_DeclareAnEmptyArrayBySizeAndCheckLength", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of ArrayList<of String>>(3)
  print a.length()
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.initialise(system.array(3), () => system.emptyArrayList());
  system.print(_stdlib.asString(_stdlib.length(a)));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "3");
  });

  test("Pass_ConfirmStringElementsInitializedToEmptyArrayNotNull", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of ArrayList<of String>>(3)
  print a[0].length()
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.initialise(system.array(3), () => system.emptyArrayList());
  system.print(_stdlib.asString(_stdlib.length(system.safeIndex(a, 0))));
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
      "0ArrayList [empty ArrayList, empty ArrayList, empty ArrayList]",
    );
  });

  ignore_test("Pass_ConfirmStringElementsInitializedToEmptyClassNotNull", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of Foo>(3)
  print a
  var foo set to a[0]
  print foo.p1
end main

class Foo
  constructor()

  end constructor

  property p1 as Int
end class
`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.initialise(system.array(3), () => Foo.emptyInstance());
  system.print(_stdlib.asString(a));
  var foo = system.safeIndex(a, 0);
  system.print(_stdlib.asString(foo.p1));
}

class Foo {
  static emptyInstance() { return system.emptyClass(Foo, [["p1", 0]]);};
  constructor() {

  }

  p1 = 0;

}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "ArrayList [a Foo, a Foo, a Foo]0");
  });

  test("Pass_SetAndReadElements1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of ArrayList<of String>>(3)
  set a[0] to ["bar", "foo"]
  set a[2] to ["yon", "xan"]
  print a[0][1]
  print a[2][0]
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.initialise(system.array(3), () => system.emptyArrayList());
  system.safeSet(a, 0, system.literalArray(["bar", "foo"]));
  system.safeSet(a, 2, system.literalArray(["yon", "xan"]));
  system.print(_stdlib.asString(system.safeDoubleIndex(a, 0, 1)));
  system.print(_stdlib.asString(system.safeDoubleIndex(a, 2, 0)));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "fooyon");
  });

  test("Pass_SetAndReadElements2", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of ArrayList<of String>>(3)
  set a[0] to ["bar", "foo"]
  set a[0][1] to "yon"
  print a[0][1]
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.initialise(system.array(3), () => system.emptyArrayList());
  system.safeSet(a, 0, system.literalArray(["bar", "foo"]));
  system.safeDoubleSet(a, 0, 1, "yon");
  system.print(_stdlib.asString(system.safeDoubleIndex(a, 0, 1)));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "yon");
  });

  test("Pass_AddAndReadElements1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of ArrayList<of String>>(3)
  call a.add(["foo"])
  call a.add(["yon"])
  print a[3]
  print a[4]
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.initialise(system.array(3), () => system.emptyArrayList());
  _stdlib.add(a, system.literalArray(["foo"]));
  _stdlib.add(a, system.literalArray(["yon"]));
  system.print(_stdlib.asString(system.safeIndex(a, 3)));
  system.print(_stdlib.asString(system.safeIndex(a, 4)));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "ArrayList [foo]ArrayList [yon]");
  });

  test("Pass_AddAndReadElements2", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of ArrayList<of String>>(3)
  call a[1].add("foo")
  call a[2].add("yon")
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.initialise(system.array(3), () => system.emptyArrayList());
  _stdlib.add(system.safeIndex(a, 1), "foo");
  _stdlib.add(system.safeIndex(a, 2), "yon");
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
      "ArrayList [empty ArrayList, ArrayList [foo], ArrayList [yon]]",
    );
  });

  test("Pass_InsertElements1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two"], ["three"]]
  call a.insert(1, ["foo"])
  call a.insert(3, ["yon"])
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.insert(a, 1, system.literalArray(["foo"]));
  _stdlib.insert(a, 3, system.literalArray(["yon"]));
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
      "ArrayList [ArrayList [one], ArrayList [foo], ArrayList [two], ArrayList [yon], ArrayList [three]]",
    );
  });

  test("Pass_InsertElements2", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two"], ["three"]]
  call a[0].insert(0, "foo")
  call a[2].insert(1, "yon")
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.insert(system.safeIndex(a, 0), 0, "foo");
  _stdlib.insert(system.safeIndex(a, 2), 1, "yon");
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
      "ArrayList [ArrayList [foo, one], ArrayList [two], ArrayList [three, yon]]",
    );
  });

  test("Pass_remove1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two"], ["three"]]
  call a.remove(0)
  call a.remove(1)
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.remove(a, 0);
  _stdlib.remove(a, 1);
  system.print(_stdlib.asString(a));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "ArrayList [ArrayList [two]]");
  });

  test("Pass_remove2", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two"], ["three"]]
  call a[0].remove(0)
  call a[2].remove(0)
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.remove(system.safeIndex(a, 0), 0);
  _stdlib.remove(system.safeIndex(a, 2), 0);
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
      "ArrayList [empty ArrayList, ArrayList [two], empty ArrayList]",
    );
  });

  test("Pass_removeFirst1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two"], ["three"], ["one"], ["two"], ["three"]]
  call a.removeFirst(["two"])
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"]), system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.removeFirst(a, system.literalArray(["two"]));
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
      "ArrayList [ArrayList [one], ArrayList [three], ArrayList [one], ArrayList [two], ArrayList [three]]",
    );
  });

  test("Pass_removeFirst2", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two"], ["three"], ["one"], ["two"], ["three"]]
  call a[1].removeFirst("two")
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"]), system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.removeFirst(system.safeIndex(a, 1), "two");
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
      "ArrayList [ArrayList [one], empty ArrayList, ArrayList [three], ArrayList [one], ArrayList [two], ArrayList [three]]",
    );
  });

  test("Pass_removeAll1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two"], ["three"], ["one"], ["two"], ["three"]]
  call a.removeAll(["two"])
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"]), system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.removeAll(a, system.literalArray(["two"]));
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
      "ArrayList [ArrayList [one], ArrayList [three], ArrayList [one], ArrayList [three]]",
    );
  });

  test("Pass_removeAll2", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [["one"], ["two", "two"], ["three"], ["one"], ["two"], ["three"]]
  call a[1].removeAll("two")
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.literalArray([system.literalArray(["one"]), system.literalArray(["two", "two"]), system.literalArray(["three"]), system.literalArray(["one"]), system.literalArray(["two"]), system.literalArray(["three"])]);
  _stdlib.removeAll(system.safeIndex(a, 1), "two");
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
      "ArrayList [ArrayList [one], empty ArrayList, ArrayList [three], ArrayList [one], ArrayList [two], ArrayList [three]]",
    );
  });

  test("Pass_InitializeAnArrayFromAList", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to {{"foo"},{"bar","yon"}}.asArrayList()
  print a.length()
  print a
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = _stdlib.asArrayList(system.immutableList([system.immutableList(["foo"]), system.immutableList(["bar", "yon"])]));
  system.print(_stdlib.asString(_stdlib.length(a)));
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
      "2ArrayList [ImmutableList {foo}, ImmutableList {bar, yon}]",
    );
  });

  test("Pass_EmptyArrayList", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to empty [[Int]]
  var b set to empty [[Int]]
  call a.add([3])
  print a
  print b
  print a is b
  print a is empty [[Int]]
  print b is empty [[Int]]
end main`;

    const objectCode = `var system; var _stdlib; var _tests = []; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var a = system.emptyArrayList();
  var b = system.emptyArrayList();
  _stdlib.add(a, system.literalArray([3]));
  system.print(_stdlib.asString(a));
  system.print(_stdlib.asString(b));
  system.print(_stdlib.asString(system.objectEquals(a, b)));
  system.print(_stdlib.asString(system.objectEquals(a, system.emptyArrayList())));
  system.print(_stdlib.asString(system.objectEquals(b, system.emptyArrayList())));
}
return [main, _tests];}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(
      fileImpl,
      "ArrayList [ArrayList [3]]empty ArrayListfalsefalsetrue",
    );
  });

  test("Fail_EmptyArrayList1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to empty [[Int]]
  set a[0][0] to 3
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    await assertObjectCodeDoesNotExecute(fileImpl, "Out of range index: 0 size: 0");
  });

  test("Fail_ApplyIndexToANonIndexable", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [1, 2]
  var b set to a[0][0]
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Cannot index Int"]);
  });

  test("Fail_1DArrayAccessedAs2D1", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>(3)
  set a[0][0] to "foo"
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Cannot index String"]);
  });

  test("Fail_1DArrayAccessedAs2D2", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of Int>(3)
  set a[0][0] to 1
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Cannot index Int"]);
  });

  test("Fail_2DArrayAccessedAs1D", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of ArrayList<of String>>(3)
  set a[0] to "foo"
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types String to ArrayList"]);
  });

  // TODO runtime range checking #474
  ignore_test("Fail_OutOfRange", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>(3)
  var b set to a[3]
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    await assertObjectCodeDoesNotExecute(fileImpl, "Failed");
  });

  ignore_test("Fail_TypeIncompatibility", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>(3)
  set a[0] to true
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types Boolean to String"]);
  });

  ignore_test("Fail_SizeNotSpecified", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>()
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["ArrayList requires 1 or 2 parameters"]);
  });

  ignore_test("Fail_SizeWrongType", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>(1.1)
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Expression must be Int"]);
  });

  ignore_test("Fail_SizeSpecifiedInSquareBrackets", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>[3]
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  // obsolete code
  ignore_test("Fail_SpecifySizeAndInitializer", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>(3) {"foo","bar","yon"}
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertDoesNotParse(fileImpl);
  });

  ignore_test("Fail_get", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  print a.get(1)
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ArrayList to ImmutableList"]);
  });

  ignore_test("Fail_getRange", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  print a.getRange(1, 2)
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ArrayList to ImmutableList"]);
  });

  ignore_test("Fail_put", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  set a to a.with(1, "TWO")
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ImmutableList to ArrayList"]);
  });

  ignore_test("Fail_withInsert", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  set a to a.withInsert(1, "TWO")
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ImmutableList to ArrayList"]);
  });

  ignore_test("Fail_withRemove", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  set a to a.withRemove(1)
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ImmutableList to ArrayList"]);
  });

  ignore_test("Fail_putAtKey", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  set a to a.withKey(1, "TWO")
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ImmutableDictionary to ArrayList"]);
  });

  ignore_test("Fail_appendWithPlus", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  set a to a + "four"
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ArrayList to Float or Int"]);
  });

  ignore_test("Fail_prependWithPlus", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["one", "two", "three"]
  set a to "four" + a
  print a
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types String to ArrayList"]);
  });

  ignore_test("Fail_2DArrayAdd", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new ArrayList<of String>(3, 3)
  call a.add("foo")
end main
`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types 2D ArrayList to ArrayList"]);
  });

  ignore_test("Fail_withRemoveFirst", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    var a set to ["one", "two", "three", "one", "two", "three"]
    set a to a.withRemoveFirst("two")
    print a
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ImmutableList to ArrayList"]);
  });

  ignore_test("Fail_withRemoveAll", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    var a set to ["one", "two", "three", "one", "two", "three"]
    set a to a.withRemoveAll("two")
    print a
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Incompatible types ImmutableList to ArrayList"]);
  });

  ignore_test("Fail_withoutGenericType", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    var a set to new ArrayList(1)
    print a
end main`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), transforms(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertDoesNotCompile(fileImpl, ["Generic parameters expected: 1 got: 0"]);
  });
});
