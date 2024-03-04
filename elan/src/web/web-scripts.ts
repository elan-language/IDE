import { editorEvent, handleClick, handleDblClick, handleKey } from "../editorHandlers";
import { CodeSourceFromString, FileImpl } from "../frames/file-impl";
import { File } from "../frames/interfaces/file";

const codeContainer = document.querySelector('.elan-code');
var file : File = new FileImpl((s) => "", true);
const hash = window.location.hash;
var doOnce = true;

if (hash) {
	const initialFile = hash.substring(1);

	fetch(initialFile)
		.then((f) => f.text())
		.then((text) => {
			const code = new CodeSourceFromString(text);
			file.parseFrom(code);
			updateContent(file.renderAsHtml());
		})
		.catch((e) => {
			console.error(e);
			updateContent(file.renderAsHtml());
		});
}
else {
	updateContent(file.renderAsHtml());
}

const upload = document.querySelector('#upload') as Element;
upload?.addEventListener('click', handleUpload);

function handleUpload(event: Event) {
	const fileSelector = document.querySelector('#file-select') as any;
	const elanFile = fileSelector.files[0];

	if (elanFile) {
		const reader = new FileReader();
		reader.addEventListener('load', (event: any) => {
			const rawCode = event.target.result;
			const code = new CodeSourceFromString(rawCode);
			file = new FileImpl((s) => "", true);
			file.parseFrom(code);
			updateContent(file.renderAsHtml());
		});
		reader.readAsText(elanFile);
	}

	event.preventDefault();
}

const download = document.querySelector('#download') as Element;
download?.addEventListener('click', handleDownload);

function handleDownload(event: Event) {
	const code = file.renderAsSource();
	const blob = new Blob([code], { type: 'plain/text' });

	const aElement = document.createElement('a');
	aElement.setAttribute('download', "code.elan");
	const href = URL.createObjectURL(blob);
	aElement.href = href;
	aElement.setAttribute('target', '_blank');
	aElement.click();
	URL.revokeObjectURL(href);

	event.preventDefault();
}

function getModKey(e: KeyboardEvent | MouseEvent) {
	return { control: e.ctrlKey, shift: e.shiftKey, alt: e.altKey };
}

/**
 * Render the document
 */
function updateContent(text: string) {
	doOnce = doOnce === undefined || doOnce ? true : false;

	codeContainer!.innerHTML = text;

	const frames = document.querySelectorAll('.elan-code [id]');

	for (var frame of frames) {
		const id = frame.id;

		frame.addEventListener('keydown', (event: Event) => {
			const ke = event as KeyboardEvent;
			const msg: editorEvent = {
				type: 'key',
				target: "frame",
				id: id,
				key: ke.key,
				modKey: getModKey(ke)
			};
			postMessage(msg);
			event.preventDefault();
			event.stopPropagation();
		});

		frame.addEventListener('click', event => {
			const ke = event as KeyboardEvent;
			const msg: editorEvent = {
				type: 'click',
				target: "frame",
				id: id,
				modKey: getModKey(ke)
			};
			postMessage(msg);
			event.preventDefault();
			event.stopPropagation();
		});

		frame.addEventListener('mousedown', event => {
			// mousedown rather than click as click does not seem to pick up shift/ctrl click
			const me = event as MouseEvent;
			if (me.button === 0 && me.shiftKey) { // left button only
				const msg: editorEvent = {
					type: 'click',
					target: "frame",
					id: id,
					modKey: getModKey(me)
				};
				postMessage(msg);
				event.preventDefault();
				event.stopPropagation();
			}
		});

		frame.addEventListener('dblclick', event => {
			const ke = event as KeyboardEvent;
			const msg: editorEvent = {
				type: 'dblclick',
				target: "frame",
				id: id,
				modKey: getModKey(ke)
			};
			postMessage(msg);
			event.preventDefault();
			event.stopPropagation();
		});
	}

	const input = document.querySelector('.focused input') as HTMLInputElement;
	const focused = document.querySelector('.focused') as HTMLUnknownElement;
	const elanCode = document.querySelector('.elan-code') as HTMLDivElement;

	if (doOnce) {
		doOnce = false;
		elanCode!.addEventListener('keydown', (event: Event) => {
			const ke = event as KeyboardEvent;
			const msg: editorEvent = {
				type: 'key',
				target: "window",
				key: ke.key,
				modKey: getModKey(ke)
			};
			postMessage(msg);
			event.preventDefault();
			event.stopPropagation();
		});
	}

	if (input) {
		input.setSelectionRange(input.value.length, input.value.length);
		input.focus();
	} else if (focused) {
		focused.focus();
	}
	else {
		elanCode.focus();
	}

	// debug check 
	if (document.querySelectorAll('.focused').length > 1) {
		console.warn("multiple focused");
	}
}

function postMessage(e: editorEvent) {
	switch (e.type) {
		case 'click':
			handleClick(e, file);
			updateContent(file.renderAsHtml());
			return;
		case 'dblclick':
			handleDblClick(e, file);
			updateContent(file.renderAsHtml());
			return;
		case 'key':
			handleKey(e, file);
			updateContent(file.renderAsHtml());
			return;
	}
}

function doImport(str : string) {
	const url = "data:text/javascript;base64," + btoa(str);
	return import(url);
}

const inp = document.getElementById("ip") as any;
const oup = document.getElementById("op") as any;

class ElanSystem {

	input() {
		return new Promise((rs) => {
			inp.addEventListener("keydown", (e : any) => {
				if (e.key === "Enter") {
					rs(inp.value);
				}
			});
		});
	}

	print(s : string) {
		oup!.value = s;
	}
}

var elanSystem = new ElanSystem();

document.getElementById("run")?.addEventListener("click", (e) => {
	inp.value = "";
	oup.value = "";
	const code = file.renderAsObjectCode();
	doImport(code).then(async (elan) => {
		if (elan.main) {
			await elan.main(elanSystem);
		}
	});
});