import { DefaultProfile } from "../../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../../frames/file-impl";
import { assertDoesNotParse, assertObjectCodeExecutes, assertObjectCodeIs, assertParses, assertStatusIsValid, ignore_test } from "./compiler-test-helpers";

suite('T_2_HelloWorld', () => {
    ignore_test('Pass_CommentsOnly', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

# comment 1
main # comment 2
    # comment 3 (indented)
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "");
    });

    ignore_test('Pass_PrintWithNoExpression', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    print
    print
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print ();
  system.print ();
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "\r\n\r\n");
    });

    test('Pass_StringLiteral', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    print "Hello World!"
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString("Hello World!"));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "Hello World!");
    });

    test('Pass_BracketsMakeNoDifference', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    print ("Hello World!")
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(("Hello World!")));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "Hello World!");
        
    });

    test('Pass_IntegerLiteral', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    print 1
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(1));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "1");
    });

    test('Pass_FloatLiteral', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    print 2.1
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(2.1));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "2.1");
    });

    ignore_test('Pass_FloatWithExponent', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 2.1e4
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(2.1E4));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "21000");
    });

    ignore_test('Pass_FloatWithExponent2', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 2.1e100
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(2.1E100));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "2.1e+100");
    });

    ignore_test('Pass_FloatWithExponent3', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print 2.1E-4
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(2.1e-4));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "0.00021");
    });

    test('Pass_CharLiteral', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print '%'
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString('%'));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, '%');
    });

    test('Pass_BoolLiteral', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    print true
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(true));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "true");
    });

    test('Pass_EmptyLine', async () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
    print ""
end main`;

        const objectCode = `var system; export function _inject(l) { system = l; };
export async function main() {
  system.print(system.asString(""));
}
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertParses(fileImpl);
        assertStatusIsValid(fileImpl);
        assertObjectCodeIs(fileImpl, objectCode);
        await assertObjectCodeExecutes(fileImpl, "");
    });

    test('Fail_noMain', () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

print "hello World!"`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertDoesNotParse(fileImpl);
    });

    test('Fail_noEnd', () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

main
  print "Hello World!"
`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertDoesNotParse(fileImpl);
    });

    test('Fail_wrongCasing', () => {
        const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

MAIN
  print "Hello World!"
end main`;

        const fileImpl = new FileImpl(() => "", new DefaultProfile(), true);
        fileImpl.parseFrom(new CodeSourceFromString(code));

        assertDoesNotParse(fileImpl);
    });
});