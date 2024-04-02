import { ExprNode } from "./expr-node";
import { BinaryOperation } from "./binary-operation";
import { AbstractSequence } from "./abstract-sequence";
import { Term } from "./term";
import { UnknownType } from "../../symbols/unknown-type";
import { Field } from "../interfaces/field";
import { FloatType } from "../../symbols/float-type";

import { withKeyword, setKeyword, toKeyword } from "../keywords";
import { IdentifierNode } from "./identifier-node";
import { KeywordNode } from "./keyword-node";
import { Sequence } from "./sequence";
import { List } from "./list";
import { SetClause } from "./set-clause";

export class WithClause extends AbstractSequence {
    
    constructor() {
        super();
    }

    parseText(text: string): void {
        var withKw = new KeywordNode(withKeyword);
        var setClause = () => new SetClause();
        var changes = new List(setClause);
        this.elements.push(withKw);
        this.elements. push(changes);
        return super.parseText(text);
    }

    renderAsObjectCode(): string {
        const codeArray = this.elements.map(e => e.renderAsObjectCode());
        const code = codeArray.join(" ");

        // kludges
        if ((this.elements[1] as BinaryOperation).matchedText.trim() === "div"){
            return `Math.floor(${code})`;
        }

        return code;
    }

}