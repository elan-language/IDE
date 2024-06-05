import { FileImpl } from "../file-impl";
import { FunctionFrame } from "../globals/function-frame";
import { isFrame } from "../helpers";
import { AstNode } from "../interfaces/ast-node";
import { Scope } from "../interfaces/scope";
import { SymbolType } from "../interfaces/symbol-type";
import { AbstractDictionaryType } from "../symbols/abstract-dictionary-type";
import { ArrayListType } from "../symbols/array-list-type";
import { DictionaryType } from "../symbols/dictionary-type";
import { FunctionType } from "../symbols/function-type";
import { GenericParameterType } from "../symbols/generic-parameter-type";
import { ImmutableDictionaryType } from "../symbols/immutable-dictionary-type";
import { ImmutableListType } from "../symbols/immutable-list-type";
import { IterType } from "../symbols/iter-type";
import { TupleType } from "../symbols/tuple-type";
import { UnknownType } from "../symbols/unknown-type";
import { transform, transformMany } from "./ast-visitor";
import { QualifierAsn } from "./qualifier-asn";
import { Transforms } from "./transforms";

export function InFunctionScope(start: Scope): boolean {
  if (start instanceof FunctionFrame) {
    return true;
  }

  if (start instanceof FileImpl) {
    return false;
  }

  if (isFrame(start)) {
    return InFunctionScope(start.getParent());
  }

  return false;
}

export function transforms(): Transforms {
  return {
    transform: transform,
    transformMany: transformMany,
  };
}

class TypeHolder implements SymbolType {
  constructor(
    public readonly symbolType: SymbolType,
    public readonly ofTypes: SymbolType[],
  ) {}
  isImmutable = false;
  name = "TypeHolder";
  toString() {
    return this.name;
  }
}

export function flatten(p: SymbolType): SymbolType[] {
  if (p instanceof ArrayListType || p instanceof ImmutableListType || p instanceof IterType) {
    return flatten(p.ofType);
  }

  if (p instanceof AbstractDictionaryType) {
    const tt = flatten(p.keyType).concat(p.valueType);
    return [new TypeHolder(p, tt)];
  }

  if (p instanceof TupleType) {
    let flattened = [] as SymbolType[];
    for (const t of p.ofTypes) {
      flattened = flattened.concat(flatten(t));
    }
    return [new TupleType(flattened)];
  }

  if (p instanceof FunctionType) {
    let flattened = [] as SymbolType[];
    for (const t of p.parametersTypes) {
      flattened = flattened.concat(flatten(t));
    }
    return flattened.concat(flatten(p.returnType));
  }

  return [p];
}

export function containsGenericType(type: SymbolType): boolean {
  if (type instanceof GenericParameterType) {
    return true;
  }
  if (
    type instanceof ArrayListType ||
    type instanceof ImmutableListType ||
    type instanceof IterType
  ) {
    return containsGenericType(type.ofType);
  }
  if (type instanceof AbstractDictionaryType) {
    return containsGenericType(type.keyType) || containsGenericType(type.valueType);
  }

  if (type instanceof TupleType) {
    return type.ofTypes.some((t) => containsGenericType(t));
  }

  return false;
}

export function generateType(type: SymbolType, matches: Map<string, SymbolType>): SymbolType {
  if (type instanceof GenericParameterType) {
    const match = matches.get(type.id);
    if (match instanceof TypeHolder) {
      return generateType(match.symbolType, matches);
    }

    return match ?? UnknownType.Instance;
  }
  if (type instanceof ArrayListType) {
    return new ArrayListType(generateType(type.ofType, matches), type.is2d);
  }
  if (type instanceof ImmutableListType) {
    return new ImmutableListType(generateType(type.ofType, matches));
  }
  if (type instanceof IterType) {
    return new IterType(generateType(type.ofType, matches));
  }
  if (type instanceof DictionaryType) {
    return new DictionaryType(
      generateType(type.keyType, matches),
      generateType(type.valueType, matches),
    );
  }
  if (type instanceof ImmutableDictionaryType) {
    return new ImmutableDictionaryType(
      generateType(type.keyType, matches),
      generateType(type.valueType, matches),
    );
  }

  return type;
}

export function minOf(a1: object[], a2: object[]) {
  return a1.length < a2.length ? a1.length : a2.length;
}

export function match(
  flattened: SymbolType[][],
  pTypes: SymbolType[][],
  matches: Map<string, SymbolType>,
) {
  const minLength = minOf(flattened, pTypes);
  for (let i = 0; i < minLength; i++) {
    const pt = flattened[i];
    const pst = pTypes[i];

    const minLength1 = minOf(pt, pst);
    for (let i = 0; i < minLength1; i++) {
      const t = pt[i];
      const st = pst[i];

      if (t instanceof GenericParameterType) {
        matches.set(t.id, st);
      }

      if (t instanceof TupleType && st instanceof TupleType) {
        match([t.ofTypes], [st.ofTypes], matches);
      }

      if (t instanceof TypeHolder && st instanceof TypeHolder) {
        match([t.ofTypes], [st.ofTypes], matches);
      }
    }
  }
}

export function matchGenericTypes(
  type: FunctionType,
  parameters: AstNode[],
  qualifier: AstNode | undefined,
) {
  const matches = new Map<string, SymbolType>();

  const flattened = type.parametersTypes.map((n) => flatten(n));

  if (type.isExtension && qualifier) {
    parameters = [(qualifier as QualifierAsn).value as AstNode].concat(parameters);
  }

  const pTypes = parameters.map((p) => flatten(p.symbolType()));

  match(flattened, pTypes, matches);

  return matches;
}
