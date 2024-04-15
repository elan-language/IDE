import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";
import { createHash } from "node:crypto";

suite('T14_Lists', () => {

  test('Pass_literalList', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [4,5,6,7,8]
  print a
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4, 5, 6, 7, 8];
  system.print(_stdlib.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "List [4, 5, 6, 7, 8]");
  });

  test('Pass_literalListOfClass', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new Foo()
  var b set to [a]
  print b
end main

class Foo
  constructor()
  end constructor

  function asString() return String
    return "foo"
  end function

end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = system.initialise(new Foo());
  var b = [a];
  system.print(_stdlib.asString(b));
}

class Foo {
  constructor() {

  }

  asString() {
    return "foo";
  }

}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "List [foo]");
  });

  test('Pass_literalListOfValueId', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to 1
  var b set to 1.1
  var c set to 'c'
  var d set to "d"
  var e set to true
  var v set to [a]
  var w set to [b]
  var x set to [c]
  var y set to [d]
  var z set to [e]
  print v
  print w
  print x
  print y
  print z
end main

class Foo
  constructor()
  end constructor

  function asString() return String
    return "foo"
  end function

end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = 1;
  var b = 1.1;
  var c = 'c';
  var d = "d";
  var e = true;
  var v = [a];
  var w = [b];
  var x = [c];
  var y = [d];
  var z = [e];
  system.print(_stdlib.asString(v));
  system.print(_stdlib.asString(w));
  system.print(_stdlib.asString(x));
  system.print(_stdlib.asString(y));
  system.print(_stdlib.asString(z));
}

class Foo {
  constructor() {

  }

  asString() {
    return "foo";
  }

}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "List [1]List [1.1]List [c]List [d]List [true]");
  });


  test('Pass_literalListOfString', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to ["Foo", "Bar"]
  print a
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = ["Foo", "Bar"];
  system.print(_stdlib.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'List [Foo, Bar]');
  });

  test('Pass_literalListWithCoercion', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [4.1,5,6,7,8]
  print a
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4.1, 5, 6, 7, 8];
  system.print(_stdlib.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'List [4.1, 5, 6, 7, 8]');
  });

  test('Pass_length', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    var a set to [4,5,6,7,8]
    print length(a)
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4, 5, 6, 7, 8];
  system.print(_stdlib.asString(_stdlib.length(a)));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, '5');
  });

  test('Pass_emptyList', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    var a set to new List<of Int>()
    print length(a)
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = system.initialise(new Array(), ["Int"]);
  system.print(_stdlib.asString(_stdlib.length(a)));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, '0');
  });

  test('Pass_index', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    var a set to [4,5,6,7,8]
    print a[2]
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4, 5, 6, 7, 8];
  system.print(_stdlib.asString(a[2]));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, '6');
  });

  test('Pass_range', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [4,5,6,7,8]
  print a[2..]
  print a[1..3]
  print a[..2]
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4, 5, 6, 7, 8];
  system.print(_stdlib.asString(a.slice(2)));
  system.print(_stdlib.asString(a.slice(1, 3)));
  system.print(_stdlib.asString(a.slice(0, 2)));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'List [6, 7, 8]List [5, 6]List [4, 5]');
  });

  test('Pass_addElementToList', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [4,5,6,7,8]
  var b set to a + 9
  print a
  print b
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4, 5, 6, 7, 8];
  var b = system.concat(a, 9);
  system.print(_stdlib.asString(a));
  system.print(_stdlib.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'List [4, 5, 6, 7, 8]List [4, 5, 6, 7, 8, 9]');
  });

  test('Pass_addListToElement', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to [4,5,6,7,8]
  var b set to 9 + a
  print a
  print b
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4, 5, 6, 7, 8];
  var b = system.concat(9, a);
  system.print(_stdlib.asString(a));
  system.print(_stdlib.asString(b));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'List [4, 5, 6, 7, 8]List [9, 4, 5, 6, 7, 8]');
  });

  test('Pass_addListToListUsingPlus', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    var a set to [4,5,6,7,8]
    var b set to [1,2,3]
    var c set to a + b
    print a
    print b
    print c
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = [4, 5, 6, 7, 8];
  var b = [1, 2, 3];
  var c = system.concat(a, b);
  system.print(_stdlib.asString(a));
  system.print(_stdlib.asString(b));
  system.print(_stdlib.asString(c));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'List [4, 5, 6, 7, 8]List [1, 2, 3]List [4, 5, 6, 7, 8, 1, 2, 3]');
  });

  test('Pass_constantLists', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

constant a set to [4,5,6,7,8]
main
  print a
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
const a = [4, 5, 6, 7, 8];

export async function main() {
  system.print(_stdlib.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'List [4, 5, 6, 7, 8]');
  });

  test('Pass_createEmptyListUsingConstructor', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var a set to new List<of Int>()
  print a
end main`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var a = system.initialise(new Array(), ["Int"]);
  system.print(_stdlib.asString(a));
}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'empty List');
  });

  test('Pass_Default', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var f set to new Foo()
  print f.it
end main
  
class Foo
  constructor()
  end constructor
  
  property it as List<of Int>
  
  function asString() return String
    return "A Foo"
  end function
end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; };
export async function main() {
  var f = system.initialise(new Foo());
  system.print(_stdlib.asString(f.it));
}

class Foo {
  constructor() {

  }

  it = system.defaultList();

  asString() {
    return "A Foo";
  }

}
`;

    const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
    fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, 'empty List');
  });

  

  // Fails TODO

});