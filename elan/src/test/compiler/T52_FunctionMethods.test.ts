import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeDoesNotExecute, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test, testHash } from "./compiler-test-helpers";
import { createHash } from "node:crypto";

suite('T52_FunctionMethods', () => {

  test('Pass_HappyCase', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var f set to new Foo()
  print f.times(2)
end main

class Foo
    constructor()
        set p1 to 5
    end constructor

    property p1 as Int

    function times(value as Int) return Int
        return p1 * value
    end function

    function asString() return String
         return ""
    end function

end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var f = system.initialise(new Foo());
  system.print(_stdlib.asString(f.times(2)));
}

class Foo {
  static defaultInstance() { return system.defaultClass(Foo, [["p1", "Int"]]);};
  constructor() {
    this.p1 = 5;
  }

  p1 = 0;

  times(value) {
    return this.p1 * value;
  }

  asString() {
    return "";
  }

}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "10");
  });

  test('Pass_FunctionMethodMayCallOtherClassFunctionViaProperty', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var f set to new Foo()
  print f.length()
end main

class Foo
    constructor()
        set p1 to new Bar()
    end constructor

    property p1 as Bar

    function length() return Int
        return p1.length() + 2
    end function

    function asString() return String
         return ""
    end function

end class

class Bar
    constructor()
        set p1 to 5
    end constructor

    property p1 as Int

    function length() return Int
        return p1
    end function

    function asString() return String
         return ""
    end function

end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var f = system.initialise(new Foo());
  system.print(_stdlib.asString(f.length()));
}

class Foo {
  static defaultInstance() { return system.defaultClass(Foo, [["p1", "Bar"]]);};
  constructor() {
    this.p1 = system.initialise(new Bar());
  }

  _p1;
  get p1() {
    return this._p1 ??= Bar.defaultInstance();
  }
  set p1(p1) {
    this._p1 = p1;
  }

  length() {
    return this.p1.length() + 2;
  }

  asString() {
    return "";
  }

}

class Bar {
  static defaultInstance() { return system.defaultClass(Bar, [["p1", "Int"]]);};
  constructor() {
    this.p1 = 5;
  }

  p1 = 0;

  length() {
    return this.p1;
  }

  asString() {
    return "";
  }

}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "7");
  });

  test('Pass_FunctionMethodMayCallOtherClassFunctionMethod', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var f set to new Foo()
  var b set to new Bar()
  print f.times(b)
end main

class Foo
    constructor()
        set p1 to 5
    end constructor

    property p1 as Int

    function times(b as Bar) return Int
        return p1PlusOne() * b.p1PlusOne()
    end function

    function p1PlusOne() return Int
        return p1 + 1
    end function

    function asString() return String
         return ""
    end function

end class

class Bar
    constructor()
        set p1 to 1
    end constructor

    property p1 as Int

    function p1PlusOne() return Int
        return p1 + 1
    end function

    function asString() return String
         return ""
    end function

end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var f = system.initialise(new Foo());
  var b = system.initialise(new Bar());
  system.print(_stdlib.asString(f.times(b)));
}

class Foo {
  static defaultInstance() { return system.defaultClass(Foo, [["p1", "Int"]]);};
  constructor() {
    this.p1 = 5;
  }

  p1 = 0;

  times(b) {
    return this.p1PlusOne() * b.p1PlusOne();
  }

  p1PlusOne() {
    return this.p1 + 1;
  }

  asString() {
    return "";
  }

}

class Bar {
  static defaultInstance() { return system.defaultClass(Bar, [["p1", "Int"]]);};
  constructor() {
    this.p1 = 1;
  }

  p1 = 0;

  p1PlusOne() {
    return this.p1 + 1;
  }

  asString() {
    return "";
  }

}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "12");
  });

  test('Pass_FunctionMethodNameHidesGlobalFunction', async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  var f set to new Foo()
  call f.prt()
end main

class Foo
  constructor()
      set p1 to 5
  end constructor

  property p1 as Int

  procedure prt()
    print asString()
  end procedure

  function asString() return String
    return library.asString(p1)
  end function

end class`;

    const objectCode = `var system; var _stdlib; export function _inject(l,s) { system = l; _stdlib = s; }; export async function program() {
async function main() {
  var f = system.initialise(new Foo());
  f.prt();
}

class Foo {
  static defaultInstance() { return system.defaultClass(Foo, [["p1", "Int"]]);};
  constructor() {
    this.p1 = 5;
  }

  p1 = 0;

  prt() {
    system.print(_stdlib.asString(this.asString()));
  }

  asString() {
    return _stdlib.asString(this.p1);
  }

}
return main;}`;

    const fileImpl = new FileImpl(testHash, new DefaultProfile(), true);
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    assertParses(fileImpl);
    assertStatusIsValid(fileImpl);
    assertObjectCodeIs(fileImpl, objectCode);
    await assertObjectCodeExecutes(fileImpl, "5");
  });


});
