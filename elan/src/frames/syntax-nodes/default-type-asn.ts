import { Field } from "../interfaces/field";
import { AstNode } from "./ast-node";

export class DefaultTypeAsn {

    constructor(private type: AstNode, private field : Field) {
       
    }

    get symbolType() {
        return this.type.symbolType;
    }

    toString() {
      
        return `Default (${this.type})`;
    }

}