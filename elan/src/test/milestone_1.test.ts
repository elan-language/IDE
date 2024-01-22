import * as vscode from 'vscode';
import { assertAreEqual } from './testHelpers';
import { T00_emptyFile, T02_comments, T03_mainWithAllStatements, T04_allGlobals, T05_snake, T06_mergeSort, T07_mainWithAllStatementsSelectMainById, T07_mainWithAllStatementsSelectStatementById, T08_collapseAll, T08_expandAll } from './testFrameFunctions';

suite('Milestone 1 - Html rendering of code from model', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Test Empty File', (done) => {
		assertAreEqual(done, "T00_emptyFile.html", T00_emptyFile);
	});
	test('Test Comments', (done) => {
		assertAreEqual(done, "T02_comments.html", T02_comments);
	});
	test('Test Main With All Statements', (done) => {
		assertAreEqual(done, "T03_mainWithAllStatements.html", T03_mainWithAllStatements);
	});
	test('Test All Globals', (done) => {
		assertAreEqual(done, "T04_allGlobals.html", T04_allGlobals);
	});
	test('Test Snake', (done) => {
		assertAreEqual(done, "T05_snake.html", T05_snake);
	});
	test('Test Merge Sort', (done) => {
		assertAreEqual(done, "T06_mergeSort.html", T06_mergeSort);
	});

	test('Test Select Main By Id', (done) => {
		const ff = T03_mainWithAllStatements();
		assertAreEqual(done, "T07_mainSelected.html", T07_mainWithAllStatementsSelectMainById(ff));
	});

	test('Test Select Statement By Id', (done) => {
		const ff = T03_mainWithAllStatements();
		assertAreEqual(done, "T07_statementSelected.html", T07_mainWithAllStatementsSelectStatementById(ff));
	});

	test('ExpandAll', (done) => {
		const ff = T03_mainWithAllStatements();
		assertAreEqual(done, "T03_mainWithAllStatements.html", T08_expandAll(ff));
	});

	test('CollapseAll', (done) => {
		const ff = T03_mainWithAllStatements();
		assertAreEqual(done, "T08_collapseAll.html", T08_collapseAll(ff));
	});
});
