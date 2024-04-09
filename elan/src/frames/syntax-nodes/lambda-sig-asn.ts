import { ISymbol } from "../../symbols/symbol";
import { ISymbolType } from "../../symbols/symbol-type";
import { Scope } from "../interfaces/scope";
import { AstNode } from "./ast-node";
import { ParamDefAsn } from "./param-def-asn";

export class LambdaSigAsn implements Scope, AstNode {

    constructor(private parameters: Array<ParamDefAsn>, private scope : Scope) {
    }
    symbolType: ISymbolType | undefined;
    renderAsObjectCode(): string {
        throw new Error("Method not implemented.");
    }

    resolveSymbol(id: string, scope: Scope): ISymbol {
        for (const p of this.parameters){
            if (p.id.trim() === id.trim()){
                return {symbolId : id, symbolType : p.symbolType};
            }
        }
        return this.scope.resolveSymbol(id, this);
    }

    toString() {
        const pp = this.parameters.map(p => p.toString()).join(", ");

        return `${pp}`;
    }
}