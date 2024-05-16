import { ISymbol } from "../interfaces/symbol";
import { SymbolScope } from "../symbols/symbol-scope";
import { CodeSource } from "../code-source";
import { ClassFrame } from "../globals/class-frame";
import { ProcedureFrame } from "../globals/procedure-frame";
import { singleIndent } from "../helpers";
import { Frame } from "../interfaces/frame";
import { Member } from "../interfaces/member";
import { Transforms } from "../syntax-nodes/transforms";

export class ProcedureMethod extends ProcedureFrame implements Member {
    isMember: boolean = true;
    private class: ClassFrame;

    constructor(parent: ClassFrame) {
        super(parent);
        this.class = parent as ClassFrame;
    }

    public override indent(): string {
        return singleIndent();
    }
    public override renderAsSource(): string {
        return `${this.indent()}procedure ${this.name.renderAsSource()}(${this.params.renderAsSource()})\r
${this.renderChildrenAsSource()}\r
${this.indent()}end procedure\r
`;
    }
    public override compile(transforms : Transforms): string {
        this.compileErrors = [];
        return `${this.indent()}${this.name.compile(transforms)}(${this.params.compile(transforms)}) {\r
${this.compileStatements(transforms)}\r
${this.indent()}}\r
`;
    }
    parseTop(source: CodeSource): void {
        source.removeIndent();
        return super.parseTop(source);
    }
    parseBottom(source: CodeSource): boolean {
        return super.parseBottom(source);
    }

    resolveSymbol(id: string | undefined, transforms: Transforms, initialScope: Frame): ISymbol {
        if (this.name.text === id) {
            return this as ISymbol;
        }

        return super.resolveSymbol(id, transforms, initialScope);
    }

    get symbolId() {
        return this.name.renderAsSource();
    }

    symbolScope = SymbolScope.property;
}