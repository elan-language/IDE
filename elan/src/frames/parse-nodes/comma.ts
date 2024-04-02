import { Field } from "../interfaces/field";
import {SymbolNode} from "./symbol-node";

//Comma is distinct from other symbols because it is always followed by a space
export class Comma extends SymbolNode {
    constructor() {
        super(",");
    }

    renderAsSource(): string {
        return this.matchedText.trim() + " ";
    }
}
