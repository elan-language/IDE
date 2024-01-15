import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { FileFrame } from '../frames/file-frame';
// import * as myExtension from '../../extension';

function wrap(html : string) {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="..\\..\\media\\elanStyle.css" rel="stylesheet" />
<title>Elan Editor</title>
</head>
<body>
<div class="code">${html}</div>
</body>
</html>`;
}


suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Test file', (done) => {
        vscode.workspace.openTextDocument("C:\\GitHub\\IDE\\elan\\src\\test\\test0.elan").then((fe) => {
			vscode.workspace.openTextDocument("C:\\GitHub\\IDE\\elan\\src\\test\\test0.html").then((fh) => {
				var model = new FileFrame(fe.getText());
				var actualHtml = wrap(model.renderAsHtml()).replaceAll("\r", "");
				var expectedHtml = fh.getText().replaceAll("\r", "");

				done(assert.strictEqual(actualHtml, expectedHtml));
			} );
		} );
	});
});
