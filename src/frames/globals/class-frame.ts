import { AbstractFrame } from "../abstract-frame";
import { AbstractSelector } from "../abstract-selector";
import { AbstractFunction } from "../class-members/abstract-function";
import { AbstractProcedure } from "../class-members/abstract-procedure";
import { AbstractProperty } from "../class-members/abstract-property";
import { Constructor } from "../class-members/constructor";
import { FunctionMethod } from "../class-members/function-method";
import { MemberSelector } from "../class-members/member-selector";
import { ProcedureMethod } from "../class-members/procedure-method";
import { Property } from "../class-members/property";
import { CodeSource } from "../code-source";
import { CompileError } from "../compile-error";
import {
  mustBeAbstractClass,
  mustBeKnownSymbolType,
  mustBeUniqueNameInScope,
  mustImplementSuperClasses,
} from "../compile-rules";
import { InheritsFrom } from "../fields/inheritsFrom";
import { OptionalKeyword } from "../fields/optionalKeyword";
import { Regexes } from "../fields/regexes";
import { TypeNameField } from "../fields/type-name-field";
import { Class } from "../interfaces/class";
import { Collapsible } from "../interfaces/collapsible";
import { Field } from "../interfaces/field";
import { File } from "../interfaces/file";
import { Frame } from "../interfaces/frame";
import { Parent } from "../interfaces/parent";
import { Profile } from "../interfaces/profile";
import { StatementFactory } from "../interfaces/statement-factory";
import { ElanSymbol } from "../interfaces/symbol";
import {
  abstractKeyword,
  classKeyword,
  immutableKeyword,
  inheritsKeyword,
  thisKeyword,
} from "../keywords";
import {
  parentHelper_addChildAfter,
  parentHelper_addChildBefore,
  parentHelper_aggregateCompileErrorsOfChildren,
  parentHelper_compileChildren,
  parentHelper_getChildAfter,
  parentHelper_getChildBefore,
  parentHelper_getChildRange,
  parentHelper_getFirstChild,
  parentHelper_getFirstSelectorAsDirectChild,
  parentHelper_getLastChild,
  parentHelper_insertOrGotoChildSelector,
  parentHelper_moveSelectedChildrenDownOne,
  parentHelper_moveSelectedChildrenUpOne,
  parentHelper_readWorstCompileStatusOfChildren,
  parentHelper_readWorstParseStatusOfChildren,
  parentHelper_removeChild,
  parentHelper_renderChildrenAsHtml,
  parentHelper_renderChildrenAsSource,
} from "../parent-helpers";
import { CommentStatement } from "../statements/comment-statement";
import { ClassType } from "../symbols/class-type";
import { DuplicateSymbol } from "../symbols/duplicate-symbol";
import { getGlobalScope, isSymbol } from "../symbols/symbol-helpers";
import { SymbolScope } from "../symbols/symbol-scope";
import { UnknownType } from "../symbols/unknown-type";
import { isAstCollectionNode, isAstIdNode } from "../syntax-nodes/ast-helpers";
import { Transforms } from "../syntax-nodes/transforms";

export class ClassFrame extends AbstractFrame implements Class, Parent, Collapsible, ElanSymbol {
  isCollapsible: boolean = true;
  isParent: boolean = true;
  isClass: boolean = true;
  public name: TypeNameField;
  public abstract: OptionalKeyword;
  public immutable: OptionalKeyword;
  public inherits: OptionalKeyword;
  public superClasses: InheritsFrom;
  private _children: Array<Frame> = new Array<Frame>();

  constructor(parent: File) {
    super(parent);
    this.name = new TypeNameField(this);
    this.abstract = new OptionalKeyword(this, abstractKeyword);
    this.immutable = new OptionalKeyword(this, immutableKeyword);
    this.inherits = new OptionalKeyword(this, inheritsKeyword);
    this.superClasses = new InheritsFrom(this);
    this.superClasses.setOptional(true);
    this.getChildren().push(new Constructor(this));
    this.getChildren().push(new MemberSelector(this));
  }
  getFile(): File {
    return this.getParent() as File;
  }

  initialKeywords(): string {
    return classKeyword;
  }
  private hasAddedMembers(): boolean {
    return (
      this.getChildren().filter((m) => !("isConstructor" in m || "isSelector" in m)).length > 0
    );
  }
  get symbolId() {
    return this.name.text;
  }
  symbolType(transforms?: Transforms) {
    return new ClassType(
      this.symbolId,
      this.isAbstract(),
      this.isImmutable(),
      this.superClasses.symbolTypes(transforms),
      this,
    );
  }
  get symbolScope() {
    return SymbolScope.program;
  }
  getProfile(): Profile {
    return this.getFile().getProfile();
  }
  protected setClasses() {
    super.setClasses();
    this.pushClass(true, "multiline");
  }

  updateParseStatus(): void {
    this.getChildren().forEach((c) => c.updateParseStatus());
    const worstOfFieldOrChildParseStatus = Math.min(
      this.worstParseStatusOfFields(),
      parentHelper_readWorstParseStatusOfChildren(this),
    );
    this.setParseStatus(worstOfFieldOrChildParseStatus);
  }

  updateCompileStatus(): void {
    this.getChildren().forEach((c) => c.updateCompileStatus());
    const worstOfChildren = parentHelper_readWorstCompileStatusOfChildren(this);
    super.updateCompileStatus(); //will update it based on fields and its own direct compile errors
    const newStatus = Math.min(this.readCompileStatus(), worstOfChildren);
    this.setCompileStatus(newStatus);
  }

  getFactory(): StatementFactory {
    return this.getParent().getFactory();
  }
  getChildren(): Frame[] {
    return this._children;
  }

  getFirstChild(): Frame {
    return parentHelper_getFirstChild(this);
  }
  getLastChild(): Frame {
    return parentHelper_getLastChild(this);
  }
  getChildAfter(child: Frame): Frame {
    return parentHelper_getChildAfter(this, child);
  }
  getChildBefore(child: Frame): Frame {
    return parentHelper_getChildBefore(this, child);
  }
  getChildRange(first: Frame, last: Frame): Frame[] {
    return parentHelper_getChildRange(this, first, last);
  }
  getFirstSelectorAsDirectChild(): AbstractSelector {
    return parentHelper_getFirstSelectorAsDirectChild(this);
  }
  addChildBefore(child: Frame, before: Frame): void {
    parentHelper_addChildBefore(this, child, before);
  }
  addChildAfter(child: Frame, before: Frame): void {
    parentHelper_addChildAfter(this, child, before);
  }
  removeChild(child: Frame): void {
    parentHelper_removeChild(this, child);
  }
  insertOrGotoChildSelector(after: boolean, child: Frame) {
    parentHelper_insertOrGotoChildSelector(this, after, child);
  }
  moveSelectedChildrenUpOne(): void {
    parentHelper_moveSelectedChildrenUpOne(this);
  }
  moveSelectedChildrenDownOne(): void {
    parentHelper_moveSelectedChildrenDownOne(this);
  }

  fieldUpdated(field: Field): void {
    if (field === this.abstract) {
      if (this.abstract.keywordExists()) {
        if ("isConstructor" in this.getChildren()[0]) {
          this.getChildren().splice(0, 1);
        }
      } else if (!("isConstructor" in this.getChildren()[0])) {
        this.getChildren().splice(0, 0, new Constructor(this));
      }
    } else if (field === this.inherits) {
      if (this.inherits.keywordExists()) {
        this.superClasses.setOptional(false);
      } else {
        this.superClasses.setFieldToKnownValidText("");
        this.superClasses.setOptional(true);
      }
    }
  }

  minimumNumberOfChildrenExceeded(): boolean {
    const children = this.getChildren().length;
    return this.isAbstract() ? children > 1 : children > 2; // Concrete class must include constructor
  }

  isAbstract(): boolean {
    return this.abstract.keywordExists();
  }
  makeAbstract(): void {
    this.abstract.specify();
  }
  isImmutable(): boolean {
    return this.immutable.keywordExists();
  }
  makeImmutable(): void {
    this.immutable.specify();
  }
  doesInherit(): boolean {
    return this.inherits.keywordExists();
  }
  makeInherits(): void {
    this.inherits.specify();
  }

  getFields(): Field[] {
    return this.hasAddedMembers()
      ? [this.name, this.inherits, this.superClasses]
      : [this.abstract, this.immutable, this.name, this.inherits, this.superClasses];
  }

  getIdPrefix(): string {
    return "class";
  }
  private modifiersAsHtml(): string {
    let result = "";
    if (this.hasAddedMembers()) {
      result += this.isAbstract() ? `<keyword>abstract </keyword>` : ``;
      result += this.isImmutable() ? `<keyword>immutable </keyword>` : ``;
    } else {
      result += `${this.abstract.renderAsHtml()} ${this.immutable.renderAsHtml()} `;
    }
    return result;
  }
  private modifiersAsSource(): string {
    let result = "";
    if (this.isAbstract()) {
      result += `abstract `;
    }
    if (this.isImmutable()) {
      result += `immutable `;
    }
    return result;
  }
  private inheritanceAsHtml(): string {
    return ` ${this.inherits.renderAsHtml()} ${this.superClasses.renderAsHtml()}`;
  }
  private inheritanceAsSource(): string {
    return this.doesInherit()
      ? ` ${this.inherits.renderAsSource()} ${this.superClasses.renderAsSource()}`
      : ``;
  }

  private inheritanceAsObjectCode(): string {
    return ``;
  }

  public renderAsHtml(): string {
    return `<classDef class="${this.cls()}" id='${this.htmlId}' tabindex="0">
<top><expand>+</expand>${this.modifiersAsHtml()}<keyword>class </keyword>${this.name.renderAsHtml()}${this.inheritanceAsHtml()}</top>${this.compileMsgAsHtml()}
${parentHelper_renderChildrenAsHtml(this)}
<keyword>end class</keyword>
</classDef>`;
  }

  indent(): string {
    return "";
  }

  public renderAsSource(): string {
    return `${this.modifiersAsSource()}class ${this.name.renderAsSource()}${this.inheritanceAsSource()}\r
${parentHelper_renderChildrenAsSource(this)}\r
end class\r\n`;
  }

  private propertiesToInit() {
    const pp = this.getChildren().filter(
      (c) => c instanceof Property || c instanceof AbstractProperty,
    ) as (AbstractProperty | Property)[];
    const ps = pp
      .map((p) => p.initCode())
      .filter((s) => s)
      .join(", ");
    return `[${ps}]`;
  }

  public compile(transforms: Transforms): string {
    this.compileErrors = [];

    const name = this.name.compile(transforms);
    mustBeUniqueNameInScope(
      name,
      getGlobalScope(this),
      transforms,
      this.compileErrors,
      this.htmlId,
    );

    if (this.doesInherit()) {
      const superClasses = this.superClasses.getOrTransformAstNode(transforms);

      if (isAstCollectionNode(superClasses)) {
        const nodes = superClasses.items.filter((i) => isAstIdNode(i));
        const typeAndName: [ClassType | UnknownType, string][] = nodes
          .map((n) => this.resolveSymbol(n.id, transforms, this))
          .map((c) => [c.symbolType(transforms) as ClassType | UnknownType, c.symbolId]);

        for (const st of typeAndName) {
          mustBeKnownSymbolType(st[0], st[1], this.compileErrors, this.htmlId);
        }

        for (const st of typeAndName) {
          mustBeAbstractClass(st[0], this.compileErrors, this.htmlId);
        }

        mustImplementSuperClasses(
          transforms,
          this.symbolType(transforms),
          typeAndName.map((tn) => tn[0]).filter((st) => st instanceof ClassType) as ClassType[],
          this.compileErrors,
          this.htmlId,
        );
      }
    }

    const asString = this.isAbstract()
      ? `
  asString() {
    return "empty Abstract Class ${name}";
  }`
      : "";

    return `class ${name}${this.inheritanceAsObjectCode()} {\r
  static emptyInstance() { return system.emptyClass(${name}, ${this.propertiesToInit()});};\r
${parentHelper_compileChildren(this, transforms)}\r${asString}\r
}\r\n`;
  }

  createFunction(): Frame {
    return new FunctionMethod(this);
  }
  createProperty(): Frame {
    return new Property(this);
  }
  createProcedure(): Frame {
    return new ProcedureMethod(this);
  }
  createAbstractFunction(): Frame {
    return new AbstractFunction(this);
  }
  createComment(): Frame {
    return new CommentStatement(this);
  }
  createAbstractProperty(): Frame {
    return new AbstractProperty(this);
  }
  createAbstractProcedure(): Frame {
    return new AbstractProcedure(this);
  }

  public getConstructor(): Constructor {
    return this.getChildren().filter((m) => "isConstructor" in m)[0] as Constructor;
  }
  parseFrom(source: CodeSource): void {
    this.parseTop(source);
    while (!this.parseBottom(source)) {
      if (source.isMatchRegEx(Regexes.newLine)) {
        source.removeRegEx(Regexes.newLine, false);
        source.removeIndent();
      } else {
        this.getFirstSelectorAsDirectChild().parseFrom(source);
      }
    }
  }
  parseTop(source: CodeSource): boolean {
    const abs = "abstract ";
    if (source.isMatch(abs)) {
      source.remove(abs);
      this.makeAbstract();
    }
    const imm = "immutable ";
    if (source.isMatch(imm)) {
      source.remove(imm);
      this.makeImmutable();
    }
    source.remove("class ");
    this.name.parseFrom(source);
    const inh = " inherits "; //Note leading & trailing space
    if (source.isMatch(inh)) {
      source.remove(inh);
      this.makeInherits();
      this.superClasses.parseFrom(source);
    }
    source.removeNewLine();
    if (!this.isAbstract()) {
      this.getConstructor().parseFrom(source);
    }
    return true;
  }

  parseBottom(source: CodeSource): boolean {
    let result = false;
    source.removeIndent();
    const keyword = "end class";
    if (source.isMatch(keyword)) {
      source.remove(keyword);
      result = true;
    }
    return result;
  }
  newChildSelector(): AbstractSelector {
    return new MemberSelector(this);
  }

  resolveSymbol(id: string, transforms: Transforms, initialScope: Frame): ElanSymbol {
    if (id === thisKeyword) {
      return this;
    }

    const matches = this.getChildren().filter(
      (f) => isSymbol(f) && f.symbolId === id,
    ) as ElanSymbol[];

    if (matches.length === 1) {
      return matches[0];
    }
    if (matches.length > 1) {
      return new DuplicateSymbol(matches);
    }

    return this.getParent().resolveSymbol(id, transforms, this);
  }

  symbolMatches(id: string, all: boolean, initialScope?: Frame | undefined): ElanSymbol[] {
    const otherMatches = this.getParent().symbolMatches(id, all, this);

    const matches = this.getChildren().filter(
      (f) => isSymbol(f) && (f.symbolId.startsWith(id) || all),
    ) as ElanSymbol[];

    return matches.concat(otherMatches);
  }

  aggregateCompileErrors(): CompileError[] {
    const cc = parentHelper_aggregateCompileErrorsOfChildren(this);
    return cc.concat(super.aggregateCompileErrors());
  }

  resetCompileStatusAndErrors(): void {
    this.getChildren().forEach((f) => f.resetCompileStatusAndErrors());
    super.resetCompileStatusAndErrors();
  }
}
