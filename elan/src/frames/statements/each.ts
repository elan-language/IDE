import { ExpressionField } from "../fields/expression-field";
import { IdentifierField } from "../fields/identifier-field";
import { Parent} from "../interfaces/parent";
import { File} from "../interfaces/file";
import { Field } from "../interfaces/field";
import { CodeSource } from "../code-source";
import { FrameWithStatements } from "../frame-with-statements";
import { Statement } from "../interfaces/statement";
import { eachKeyword } from "../keywords";
import { Frame } from "../interfaces/frame";
import { ISymbol, SymbolScope } from "../../symbols/symbol";
import { mustBeIterable, mustNotBeReassigned } from "../compile-rules";

export class Each extends FrameWithStatements implements Statement {
    isStatement = true;
    variable: IdentifierField;
    iter: ExpressionField;

    constructor(parent: File | Parent) {
        super(parent);
        this.variable = new IdentifierField(this);
        this.variable.setPlaceholder("variableName");
        this.iter = new ExpressionField(this);
        this.iter.setPlaceholder("iterable value or expression");
    }
    initialKeywords(): string {
        return eachKeyword;
    }

    getFields(): Field[] {
        return [this.variable, this.iter];
    }

    getIdPrefix(): string {
        return 'each';
    }
    renderAsHtml(): string {
        return `<statement class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand><keyword>each </keyword>${this.variable.renderAsHtml()}<keyword> in </keyword>${this.iter.renderAsHtml()}</top>${this.compileMsgAsHtml()}
${this.renderChildrenAsHtml()}
<keyword>end each</keyword>
</statement>`;
    }

    renderAsSource(): string {
        return `${this.indent()}each ${this.variable.renderAsSource()} in ${this.iter.renderAsSource()}\r
${this.renderChildrenAsSource()}\r
${this.indent()}end each`;
    }

    compile(): string {
        this.compileErrors = [];

        const id = this.variable.getOrTransformAstNode?.compile();
        const symbol = this.getParent().resolveSymbol(id!, this);

        mustNotBeReassigned(symbol, this.compileErrors, this.variable.getHtmlId());

        const iterType = this.iter.getOrTransformAstNode?.symbolType;
        mustBeIterable(iterType!, this.compileErrors, this.htmlId);

        return `${this.indent()}for (const ${this.variable.compile()} of ${this.iter.compile()}) {\r
${this.renderChildrenAsObjectCode()}\r
${this.indent()}}`;
    }

    parseTop(source: CodeSource): void {
        source.remove("each ");
        this.variable.parseFrom(source);
        source.remove(" in ");
        this.iter.parseFrom(source);
    }
    parseBottom(source: CodeSource): boolean {
        return this.parseStandardEnding(source, "end each");
    }

    resolveSymbol(id: string | undefined, initialScope : Frame): ISymbol {
        const v = this.variable.text;
        
        if (id === v) {
            const st = (this.iter.symbolType as any).ofType; // todo fix type
            return {
                symbolId: id,
                symbolType: st,
                symbolScope: SymbolScope.local
            };
        }

        const iter = this.iter.text;

        if (id === iter) {
            // intercept iter resolve in order to make counter so it's immutable
            const symbol = super.resolveSymbol(id, this);
            return {
                symbolId: id,
                symbolType: symbol.symbolType,
                symbolScope: SymbolScope.counter
            };
        }



        return super.resolveSymbol(id, this);
    }
} 
