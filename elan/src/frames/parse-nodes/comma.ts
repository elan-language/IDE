import { UnknownType } from "../../symbols/UnknownType";
import {Symbol} from "./symbol";

//Comma is distinct from other symbols because it is always followed by a space
export class Comma extends Symbol {
    constructor() {
        super(",");
    }

    

    renderAsSource(): string {
        return this.matchedText.trim() + " ";
    }

    get symbolType() {
        return new UnknownType();
    }
}
