import { UnknownType } from "../../symbols/UnknownType";
import { Field } from "../interfaces/field";
import {Symbol} from "./symbol";

//Comma is distinct from other symbols because it is always followed by a space
export class Comma extends Symbol {
    constructor(field : Field) {
        super(",", field);
    }

    renderAsSource(): string {
        return this.matchedText.trim() + " ";
    }

    get symbolType() {
        return UnknownType.Instance;
    }
}
