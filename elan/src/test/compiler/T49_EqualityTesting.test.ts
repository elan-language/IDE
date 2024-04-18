import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";
import { createHash } from "node:crypto";

suite('T49_EqualityTesting', () => {

  test('Pass_DifferentInstancesWithSameValuesAreEqual', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var x set to new Foo(7, "Apple")
  var y set to new Foo(7, "Orange")
  var z set to new Foo(7, "Orange")
  print x is x
  print x is y
  print y is z
end main

class Foo
    constructor(p1 as Int, p2 as String)
        set property.p1 to p1
        set property.p2 to p2
    end constructor
    property p1 as Int
    property p2 as String

    procedure setP1(v as Int)
        set p1 to v
    end procedure

    function asString() return String
      return "{p1} {p2}"
    end function
end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var x = system.initialise(new Foo(7, "Apple"));
  var y = system.initialise(new Foo(7, "Orange"));
  var z = system.initialise(new Foo(7, "Orange"));
  system.print(_stdlib.asString(system.objectEquals(x, x)));
  system.print(_stdlib.asString(system.objectEquals(x, y)));
  system.print(_stdlib.asString(system.objectEquals(y, z)));
}

class Foo {
  static defaultInstance() { return system.defaultClass(Foo, [["p1", "Int"], ["p2", "String"]]);};
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }

  p1 = 0;

  p2 = "";

  setP1(v) {
    this.p1 = v;
  }

  asString() {
    return \`\${_stdlib.asString(this.p1)} \${_stdlib.asString(this.p2)}\`;
  }

}
return main;}`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "truefalsetrue");
  });

  test('Pass_EmptyDoesNotEqualDefault', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var x set to new Foo()
  print x is default Foo
end main

class Foo
    constructor()
    end constructor
    property p1 as Int
    property p2 as String

    procedure setP1(v as Int)
        set p1 to v
    end procedure

    function asString() return String
      return "{p1} {p2}"
    end function
end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var x = system.initialise(new Foo());
  system.print(_stdlib.asString(system.objectEquals(x, Foo.defaultInstance())));
}

class Foo {
  static defaultInstance() { return system.defaultClass(Foo, [["p1", "Int"], ["p2", "String"]]);};
  constructor() {

  }

  p1 = 0;

  p2 = "";

  setP1(v) {
    this.p1 = v;
  }

  asString() {
    return \`\${_stdlib.asString(this.p1)} \${_stdlib.asString(this.p2)}\`;
  }

}
return main;}`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "true");
  });

  

  // Fails TODO

});