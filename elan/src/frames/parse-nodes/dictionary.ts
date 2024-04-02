import { ParseNode } from "./parse-node";
import { Field } from "../interfaces/field";
import { IHasSymbolType } from "../../symbols/has-symbol-type";
import { KVPnode } from "./kvp-node";
import { AbstractParseNode } from "./abstract-parse-node";
import { List } from "./list";

export class Dictionary extends AbstractParseNode implements IHasSymbolType  {

    listConstructor: () => ParseNode;
    kvpConstructor: () => ParseNode;

    constructor(keyConstructor: () => ParseNode, valueConstructor: () => ParseNode ) {
        super();
        this.kvpConstructor = () => new KVPnode(keyConstructor, valueConstructor);
        this.listConstructor = () => new List(this.kvpConstructor);
    }

    parseText(text: string): void {
        if (text.trimStart().length > 0) {
            var list = this.listConstructor();
            list.parseText(text);
            this.updateFrom(list);
        }
    }
    
    get symbolType() {
       return undefined;
    }
}