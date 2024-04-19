import { AbstractAlternatives } from "./abstract-alternatives";
import { TypeWithOptGenerics } from "./type-with-opt-generics";
import { TypeTuple } from "./type-tuple";
import { FuncTypeNode } from "./func-type-node";

export class TypeNode extends AbstractAlternatives {

    constructor() {
        super();
        this.completionWhenEmpty = "Type";
    }

    parseText(text: string): void {
        this.remainingText = text;
        if (text.length > 0) {
            // Func - tested first because 'Func' is syntactically valid as a simple type name
            if (text.trimStart().startsWith("Func")) {
                this.alternatives.push(new FuncTypeNode());
            } else if (text.trimStart().startsWith("(")) {
                var tuple = new TypeTuple();
                this.alternatives.push(tuple);
            } 
            this.alternatives.push(new TypeWithOptGenerics());
            super.parseText(text.trimStart());
        }
    }


}
