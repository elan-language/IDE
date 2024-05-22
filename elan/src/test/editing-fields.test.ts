import assert from "assert";
import * as vscode from "vscode";
import { DefaultProfile } from "../frames/default-profile";
import { CodeSourceFromString, FileImpl } from "../frames/file-impl";
import { hash } from "../util";
import { key } from "./testHelpers";
import { Constant } from "../frames/globals/constant";
import { MainFrame } from "../frames/globals/main-frame";
import { SetStatement } from "../frames/statements/set-statement";
import { GlobalFunction } from "../frames/globals/global-function";
import { testHash, transforms } from "./compiler/compiler-test-helpers";

suite("Editing Fields Tests", () => {
  vscode.window.showInformationMessage("Start all unit tests.");

  test("Simple entry & editing of text in a name", async () => {
    const code = `# FFFFFFFFFFFFFFFF Elan v0.1 valid

    constant a set to 3
    main
      print a
    end main
    `;

    const fileImpl = new FileImpl(
      testHash,
      new DefaultProfile(),
      transforms(),
      true,
    );
    await fileImpl.parseFrom(new CodeSourceFromString(code));

    const con = fileImpl.getFirstChild() as Constant;

    const name = con.name;
    assert.equal(name.text, "a");
    assert.equal(name.cursorPos, 0);
    name.processKey(key("ArrowRight"));
    assert.equal(name.text, "a");
    assert.equal(name.cursorPos, 1);
    name.processKey(key("b"));
    name.processKey(key("c"));
    name.processKey(key("d"));
    name.processKey(key("e"));
    assert.equal(name.text, "abcde");
    assert.equal(name.cursorPos, 5);
    name.processKey(key("Backspace"));
    assert.equal(name.text, "abcd");
    assert.equal(name.cursorPos, 4);
    name.processKey(key("ArrowLeft"));
    name.processKey(key("ArrowLeft"));
    assert.equal(name.text, "abcd");
    assert.equal(name.cursorPos, 2);
    name.processKey(key("Delete"));
    assert.equal(name.text, "abd");
    assert.equal(name.cursorPos, 2);
    name.processKey(key("Backspace"));
    assert.equal(name.text, "ad");
    assert.equal(name.cursorPos, 1);
    name.processKey(key("ArrowLeft"));
    assert.equal(name.text, "ad");
    assert.equal(name.cursorPos, 0);
    name.processKey(key("ArrowLeft"));
    assert.equal(name.text, "ad");
    assert.equal(name.cursorPos, 0); // i.e. no further left
    name.processKey(key("End"));
    assert.equal(name.text, "ad");
    assert.equal(name.cursorPos, 2);
    name.processKey(key("ArrowRight"));
    assert.equal(name.text, "ad");
    assert.equal(name.cursorPos, 2); // no further right
    name.processKey(key("f"));
    assert.equal(name.text, "adf");
    assert.equal(name.cursorPos, 3);
    name.processKey(key("Home"));
    assert.equal(name.text, "adf");
    assert.equal(name.cursorPos, 0);
  });

  test("Entry of text with formatting", () => {
    const main = new MainFrame(
      new FileImpl(hash, new DefaultProfile(), transforms()),
    );
    const set = new SetStatement(main);
    const expr = set.expr;
    expr.processKey(key("3"));
    assert.equal(expr.text, "3");
    assert.equal(expr.cursorPos, 1);
    expr.processKey(key(" "));
    assert.equal(expr.text, "3 ");
    assert.equal(expr.cursorPos, 2);
    assert.equal(expr.getCompletion(), "<pr>operator </pr><pr>expression</pr>");
    expr.processKey(key("+"));
    assert.equal(expr.text, "3 + ");
    assert.equal(expr.cursorPos, 4);
    assert.equal(expr.getCompletion(), "<pr>expression</pr>");
    expr.processKey(key(" "));
    assert.equal(expr.text, "3 + ");
    assert.equal(expr.cursorPos, 4);
    assert.equal(expr.getCompletion(), "<pr>expression</pr>");
    expr.processKey(key("4"));
    assert.equal(expr.text, "3 + 4");
    assert.equal(expr.cursorPos, 5);
    assert.equal(expr.getCompletion(), "");
    expr.processKey(key("Backspace"));
    assert.equal(expr.text, "3 + ");
    assert.equal(expr.cursorPos, 4);
    expr.processKey(key("Backspace"));
    assert.equal(expr.text, "3 +");
    assert.equal(expr.cursorPos, 3);
    expr.processKey(key("Backspace"));
    assert.equal(expr.text, "3 ");
    assert.equal(expr.cursorPos, 2);
    expr.processKey(key("Backspace"));
    assert.equal(expr.text, "3");
    assert.equal(expr.cursorPos, 1);
    expr.processKey(key("Backspace"));
    assert.equal(expr.text, "");
    assert.equal(expr.cursorPos, 0);
    expr.processKey(key("Backspace"));
    assert.equal(expr.text, "");
    assert.equal(expr.cursorPos, 0);
  });

  test("Entry of text with formatting 2", () => {
    const f = new GlobalFunction(
      new FileImpl(hash, new DefaultProfile(), transforms()),
    );
    const t = f.returnType;
    t.processKey(key("F"));
    assert.equal(t.text, "F");
    assert.equal(t.cursorPos, 1);
    t.processKey(key("<"));
    assert.equal(t.text, "F<");
    assert.equal(t.cursorPos, 2);
    assert.equal(t.getCompletion(), "of <pr>Type</pr>>");
    t.processKey(key("ArrowRight"));
    assert.equal(t.text, "F<of ");
    assert.equal(t.cursorPos, 5);
    assert.equal(t.getCompletion(), "<pr>Type</pr>>");
    t.processKey(key("ArrowRight"));
    assert.equal(t.text, "F<of "); //i.e. does not accept a prompt as text
    assert.equal(t.cursorPos, 5);
    assert.equal(t.getCompletion(), "<pr>Type</pr>>");
    t.processKey(key("B"));
    t.processKey(key("ArrowRight"));
    assert.equal(t.text, "F<of B>");
    assert.equal(t.getCompletion(), "");
    assert.equal(t.cursorPos, 7);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "F<of B");
    assert.equal(t.getCompletion(), ">");
    assert.equal(t.cursorPos, 6);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "F<of ");
    assert.equal(t.getCompletion(), "<pr>Type</pr>>");
    assert.equal(t.cursorPos, 5);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "F<of");
    assert.equal(t.getCompletion(), " <pr>Type</pr>>");
    assert.equal(t.cursorPos, 4);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "F<o");
    assert.equal(t.getCompletion(), "f <pr>Type</pr>>");
    assert.equal(t.cursorPos, 3);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "F<");
    assert.equal(t.getCompletion(), "of <pr>Type</pr>>");
    assert.equal(t.cursorPos, 2);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "F");
    assert.equal(t.getCompletion(), "");
    assert.equal(t.cursorPos, 1);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "");
    assert.equal(t.getCompletion(), "<pr>Type</pr>");
    assert.equal(t.cursorPos, 0);
    t.processKey(key("Backspace"));
    assert.equal(t.text, "");
    assert.equal(t.getCompletion(), "<pr>Type</pr>");
    assert.equal(t.cursorPos, 0);
  });

  test("Entry of text with formatting 3", () => {
    const f = new GlobalFunction(
      new FileImpl(hash, new DefaultProfile(), transforms()),
    );
    const t = f.returnType;
    t.processKey(key("("));
    assert.equal(t.text, "(");
    assert.equal(t.cursorPos, 1);
    assert.equal(t.getCompletion(), "<pr>Type</pr>)");
    t.processKey(key("F"));
    t.processKey(key("o"));
    t.processKey(key("o"));
    t.processKey(key(","));
    assert.equal(t.text, "(Foo, ");
    assert.equal(t.cursorPos, 6);
    assert.equal(t.getCompletion(), "<pr>Type</pr>)");
    t.processKey(key("B"));
    t.processKey(key("a"));
    t.processKey(key("r"));
    assert.equal(t.text, "(Foo, Bar");
    assert.equal(t.cursorPos, 9);
    assert.equal(t.getCompletion(), ")");
    t.processKey(key("Backspace"));
    assert.equal(t.text, "(Foo, Ba");
    t.processKey(key("Backspace"));
    assert.equal(t.text, "(Foo, B");
    t.processKey(key("Backspace"));
    assert.equal(t.text, "(Foo, ");
    assert.equal(t.cursorPos, 6);
    assert.equal(t.getCompletion(), "<pr>Type</pr>)");
    t.processKey(key("Backspace"));
    assert.equal(t.text, "(Foo,");
    assert.equal(t.cursorPos, 5);
    assert.equal(t.getCompletion(), "<pr>Type</pr>)");
    t.processKey(key("Backspace"));
    assert.equal(t.text, "(Foo");
    assert.equal(t.cursorPos, 4);
    assert.equal(t.getCompletion(), ")");
    t.processKey(key("Backspace"));
    t.processKey(key("Backspace"));
    t.processKey(key("Backspace"));
    t.processKey(key("Backspace"));
    assert.equal(t.text, ""); //i.e. does not accept a prompt as text
    assert.equal(t.cursorPos, 0);
  });
});
