import * as vscode from 'vscode';
import { Selectable } from '../frames/interfaces/selectable';
import assert from 'assert';
import { File } from '../frames/interfaces/file';
import * as jsdom from 'jsdom';
import { editorEvent } from '../frames/interfaces/editor-event';
import { FileImpl } from '../frames/file-impl';
import { CodeSourceFromString } from '../frames/code-source';
import { hash } from '../util';
import { DefaultProfile } from '../frames/default-profile';
import { ParseStatus } from '../frames/parse-status';
import { ParseNode } from '../frames/parse-nodes/parse-node';
import { ISymbolType } from '../symbols/ISymbolType';
import { isHasSymbolType } from '../symbols/symbolHelpers';

// flag to update test file 
var updateTestFiles = false;

function updateTestFile(testDoc: vscode.TextDocument, newContent: string) {
    const edit = new vscode.WorkspaceEdit();

    edit.replace(
        testDoc.uri,
        new vscode.Range(0, 0, testDoc.lineCount, 0),
        newContent);

    vscode.workspace.applyEdit(edit).then(ok => {
        if (ok) {
            testDoc.save().then(b => {
                if (!b) {
                    console.warn("Save failed: " + testDoc.fileName);
                }
            });
        }
        else {
            console.warn("Edit failed: " + testDoc.fileName);
        }
    });  
}

export function wrap(html: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="..\\..\\..\\media\\elanStyle.css" rel="stylesheet" />
<title>Elan Editor</title>
</head>
<body>
<elan-code>
${html}
</elan-code>
</body>
</html>`;
}

export async function assertAreEqualByHtml(done: Mocha.Done, htmlFile: string, frame: () => File) {
    const ws = vscode.workspace.workspaceFolders![0].uri;

    const htmlUri = vscode.Uri.joinPath(ws, htmlFile);
    const htmlDoc = await vscode.workspace.openTextDocument(htmlUri);
    const model = frame();
    // get rid of \r for appveyor
    const actualHtml = wrap(model.renderAsHtml()).replaceAll("\r", "");
    const expectedHtml = htmlDoc.getText().replaceAll("\r", "");

    try {
        assert.strictEqual(actualHtml, expectedHtml);
        done();
    }
    catch (e) {
        if (updateTestFiles) {
            updateTestFile(htmlDoc, actualHtml);
        }
        done(e);
        throw e;
    }
}

export async function assertAreEqualBySource(done: Mocha.Done, sourceFile: string, frame: () => File) {
    const ws = vscode.workspace.workspaceFolders![0].uri;

    const sourceUri = vscode.Uri.joinPath(ws, sourceFile);
    const sourceDoc = await vscode.workspace.openTextDocument(sourceUri);
    const model = frame();
    // get rid of \r for appveyor
    const actualSource = model.renderAsSource().replaceAll("\r", "");
    const expectedSource = sourceDoc.getText().replaceAll("\r", "");

    try {
        assert.strictEqual(actualSource, expectedSource);
        done();
    }
    catch (e) {
        done(e);
        throw e;
    }
}

export async function assertFileParses(done: Mocha.Done, sourceFile: string) {
    const ws = vscode.workspace.workspaceFolders![0].uri;
    const sourceUri = vscode.Uri.joinPath(ws, sourceFile);
    const sourceDoc = await vscode.workspace.openTextDocument(sourceUri);
    var codeSource = new CodeSourceFromString(sourceDoc.getText());
    var fl = new FileImpl(hash, new DefaultProfile());
    fl.parseFrom(codeSource);
    if (fl.parseError) {
        throw new Error(fl.parseError);
    }
    const actualSource = fl.renderAsSource().replaceAll("\r", "");
    const expectedSource = sourceDoc.getText().replaceAll("\r", "");
    try {
        assert.strictEqual(actualSource, expectedSource);
        done();
    }
    catch (e) {
        done(e);
        throw e;
    }
}

export async function loadFileAsModel(sourceFile: string): Promise<FileImpl> {
    const ws = vscode.workspace.workspaceFolders![0].uri;
    const sourceUri = vscode.Uri.joinPath(ws, sourceFile);
    const sourceDoc = await vscode.workspace.openTextDocument(sourceUri);
    var codeSource = new CodeSourceFromString(sourceDoc.getText());
    var fl = new FileImpl(hash, new DefaultProfile());
    fl.parseFrom(codeSource);
    if (fl.parseError) {
        throw new Error(fl.parseError);
    }
   return fl;
}

export async function assertAreEqualByFile<T extends Selectable>(done: Mocha.Done, htmlFile: string, elanFile: string, frame: (s: string) => T) {
    const ws = vscode.workspace.workspaceFolders![0].uri;

    const elanUri = vscode.Uri.joinPath(ws, elanFile);
    const htmlUri = vscode.Uri.joinPath(ws, htmlFile);
    const elanDoc = await vscode.workspace.openTextDocument(elanUri);
    const htmlDoc = await vscode.workspace.openTextDocument(htmlUri);
    const model = frame(elanDoc.getText());
    const actualHtml = wrap(model.renderAsHtml()).replaceAll("\r", "");
    const expectedHtml = htmlDoc.getText().replaceAll("\r", "");

    try {
        assert.strictEqual(actualHtml, expectedHtml);
        done();
    }
    catch (e) {
        done(e);
        throw e;
    }
}

export function assertElementsById(dom : jsdom.JSDOM, id: string, expected: string){
	const e = dom.window.document.getElementById(id);
	const c = e?.className;
	assert.strictEqual(c, expected);
}

export function assertElementHasClasses(f: File, elementId: string, classes : string){
	const dom = readAsDOM(f);
    assertElementsById(dom, elementId, classes);
}

export function assertElementHtmlById(dom : jsdom.JSDOM, id: string, expected: string){
	const e = dom.window.document.getElementById(id);
	const c = e?.innerHTML;
	assert.strictEqual(c, expected);
}

export function assertElementContainsHtml(f: File, id: string, expectedHtml: string){
    const dom = readAsDOM(f);
	const e = dom.window.document.getElementById(id);
	const c = e?.innerHTML;
	assert.strictEqual(c, expectedHtml);
}

export function readAsDOM(f: File) {
	return new jsdom.JSDOM(f.renderAsHtml());
}

export function assertClasses(setupFn : () => File, testFn : (f: File) => void, assertClasses : [string, string, string]){
    const ff = setupFn();
	const preDom = readAsDOM(ff);
    testFn(ff);
    const postDom = readAsDOM(ff);

    assertElementsById(preDom, assertClasses[0], assertClasses[1]);
    assertElementsById(postDom, assertClasses[0], assertClasses[2]);
}

export function assertHtml(setupFn : () => File, testFn : (f: File) => void, assertClasses : [string, string]){
    const ff = setupFn();
    testFn(ff);
    const postDom = readAsDOM(ff);

    assertElementHtmlById(postDom, assertClasses[0], assertClasses[1]);
}

export function key(k: string, shift?: boolean, control?: boolean, alt?: boolean): editorEvent {
    return { key: k, modKey: {shift: !!shift, control: !!control, alt: !!alt }, type: "key", target: "frame"};
}

export async function activate(docUri: vscode.Uri) {
    // The extensionId is `publisher.name` from package.json
    const ext = vscode.extensions.getExtension('undefined_publisher.elan')!;

    if (!ext){
        const all = vscode.extensions.all;
        assert.fail(all[all.length -1].id);
    }

    await ext.activate();
    try {
      const doc = await vscode.workspace.openTextDocument(docUri);
      const editor = await vscode.window.showTextDocument(doc);
      await sleep(20000); // Wait for server activation
    } catch (e) {
      console.error(e);
    }
  }
  
  async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //Keys
  export function enter() {
    return key("Enter");
  }
  export function shift_enter() {
    return key("Enter", true);
  }
  export function tab() {
    return key("Tab");
  }
  export function shift_tab() {
    return key("Tab", true);
  }
  export function up() {
    return key("ArrowUp");
  }
  export function shift_up() {
    return key("ArrowUp",true);
  }
  export function ctrl_up() {
    return key("ArrowUp",false,true);
  }
  export function down() {
    return key("ArrowDown");
  }
  export function shift_down() {
    return key("ArrowDown",true);
  }
  export function ctrl_down() {
    return key("ArrowDown",false,true);
  }
  export function left() {
    return key("ArrowLeft");
  }
  export function right() {
    return key("ArrowRight");
  }
  export function home() {
    return key("Home");
  }
  export function end() {
    return key("End");
  }
  export function esc() {
    return key("Escape");
  }
  export function ins() {
    return key("Insert");
  }
  export function del() {
    return key("Delete");
  }
  export function shift_ins() {
    return key("Insert",true);
  }

  export function testNodeParse(node: ParseNode, text: string, status: ParseStatus, 
        matchedText: string, remainingText: string, source = "", html="", symbolType? : ISymbolType ) {
    node.parseText(text);
    assert.equal(node.status, status);
    if (matchedText !== "") {
      assert.equal(node.matchedText, matchedText);
    }
    if (remainingText !== "") {
    assert.equal( node.remainingText, remainingText);
    }
    if (source !== "") {
      assert.equal(node.renderAsSource(), source);
    }
    if (html && html !== "") {
      assert.equal(node.renderAsHtml(), html);
    }
    if (symbolType && isHasSymbolType(node)) {
      assert.strictEqual(node.symbolType?.name, symbolType.name, text);
    }
  }