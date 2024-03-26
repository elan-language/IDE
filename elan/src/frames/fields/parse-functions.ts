import { ParseStatus } from "../parse-status";
import { Regexes } from "./regexes";
import { TypeList } from "./type-list";

function isMatchRegEx(code: string, regEx: RegExp): boolean {
    var matches = code.match(regEx);
    return matches !== null && matches.length > 0;
}

function removeRegEx(code: string, regx: RegExp): string {
    if (!isMatchRegEx(code, regx)) {
        throw new Error(`Code does not match ${regx}`);
    } else {
        return code.replace(code.match(regx)![0], "");
    }
}

export function genericString(input: [ParseStatus, string], match: string): [ParseStatus, string] {
    var result = input;
    if (match.length === 0) {
        throw new Error("Cannot specify empty string as the match");
    }
    var [_, code] = input;
    if (code.length ===0) {
        result = [ParseStatus.invalid, code];
    } else if (code.startsWith(match)) {
        result = [ParseStatus.valid, code.substring(match.length)];
    } else if (match.startsWith(code)) {
        result = [ParseStatus.incomplete, ""];
    } else {
        result = [ParseStatus.invalid, code];
    }
    return result;
}

export function singleChar(input: [ParseStatus, string], char: string ): [ParseStatus, string] {
  var result = input;
  if (input[0] >= ParseStatus.valid) {
    if (input[1].startsWith(char)){
        result = [ParseStatus.valid, input[1].substring(1)];
    } else {
        result =  [ParseStatus.invalid, input[1]];
    }
  } 
  return result;
}

export function identifier(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^${Regexes.identifier}`);
}

export function variableDotMember(input: [ParseStatus, string]) {
  return SEQ(input, [variableUse, dot, identifier]);
} 

export function procedureRef(input: [ParseStatus, string]): [ParseStatus, string] {
   return LongestMatchFrom(input, [identifier, variableDotMember]);
}

function genericRegEx(input: [ParseStatus, string], regxString: string): [ParseStatus, string] {
    var result = input;
    var regx = new RegExp(regxString);
    if (isMatchRegEx(input[1], regx)) {
        result = [ParseStatus.valid, removeRegEx(input[1], regx)];
    } else {
        result = [ParseStatus.invalid, input[1]];
    }
    return result;
}

export function type(input: [ParseStatus, string]): [ParseStatus, string] {
    return firstValidMatchOrLongestIncomplete(input, [singleType, enumType]);
}

export function singleType(input: [ParseStatus, string]): [ParseStatus, string] {
    return SEQ(input, [simpleType, generic_opt]);
}

export function typeList(input: [ParseStatus, string]): [ParseStatus, string] {
    return CSV_1(input, type);
}

export function enumType(input: [ParseStatus, string]): [ParseStatus, string] {
    return SEQ(input, [openBracket, typeList, closeBracket]);
}

export function deconstructedTuple(input: [ParseStatus, string]): [ParseStatus, string] {
  return SEQ(input, [openBracket, identifierList, closeBracket]);
}

export function simpleType(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^${Regexes.simpleType}`);
}

export function generic_opt(input: [ParseStatus, string]): [ParseStatus, string] {
    var open =  (input: [ParseStatus, string]) => genericString(input, "<of ");
    var gen = (input: [ParseStatus, string]) => SEQ(input, [open, typeList, close]);
    var close =  (input: [ParseStatus, string]) => singleChar(input, ">");
    return optional(input, gen);
}

export function sp(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^\\s+`);
}

export function optSp(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^\\s*`);
}

export function comma(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^\\s*,\\s*`);
}

export function SEQ(input: [ParseStatus, string], funcs: Array<(input: [ParseStatus, string]) => [ParseStatus, string]>): [ParseStatus, string]
{
    var i = 0; //Index
    var result: [ParseStatus, string] = [ ParseStatus.notParsed, input[1]];
    while (i < funcs.length && result[0] >= ParseStatus.valid) { 
        var prev = result[0]; 
        result = funcs[i](result);     
        if (i > 0 && result[0] === ParseStatus.invalid && prev === ParseStatus.valid) {
            result = [ParseStatus.incomplete, result[1]];
        } else {
            i++;
        }
    }
    return result;
}

export function paramDef(input: [ParseStatus, string]): [ParseStatus, string] {
    var out = (input: [ParseStatus, string]) => genericString(input, "out ");
    var out_opt = (input: [ParseStatus, string]) => optional(input, out);
    return SEQ(input, [out_opt, identifier, sp, type]);
}

export function optional(input: [ParseStatus, string], func: (input: [ParseStatus, string]) => [ParseStatus, string]): [ParseStatus, string] {
    var result = input;
    if (input[0] >= ParseStatus.valid) {
        var result = func(input);
        if (result[0] === ParseStatus.invalid) {
            result = [input[0], result[1]];
        }
    }
    return result;
}

// 'Zero or more'
export function STAR(input: [ParseStatus, string], func: (input: [ParseStatus, string]) => [ParseStatus, string]) {
    var result = input;
    while (result[0] > ParseStatus.incomplete && result[1].length > 0) {  
        result = func(result);     
    }
    return result[0] === ParseStatus.notParsed ? [ParseStatus.valid, result[1]] : result;
}

// 'one or more'
export function PLUS(input: [ParseStatus, string], func: (input: [ParseStatus, string]) => [ParseStatus, string]) {
    var result = input;
    var count = 0;
    while (result[0] > ParseStatus.incomplete && result[1].length > 0) {  
        result = func(result); 
        if (result[0] > ParseStatus.invalid) {
            count ++;
        }   
    }
    return count > 0 ? result : [ParseStatus.invalid, result[1]];
}

export function CSV_1(input: [ParseStatus, string],  func: (input: [ParseStatus, string]) => [ParseStatus, string]): [ParseStatus, string] {
   var result = func(input);
   var cont = true;
   while (result[0] === ParseStatus.valid && result[1].length > 0 && cont) {
        var result2 = SEQ(result, [comma, func]);
        if (result2[0] >ParseStatus.invalid) {
            result = result2;
        } else {
            cont = false;
        }
   }
   return result;
}

export function CSV_0(input: [ParseStatus, string],  func: (input: [ParseStatus, string]) => [ParseStatus, string]): [ParseStatus, string] {
    var result = func(input);
    if (result[0] === ParseStatus.valid) {
        var cont = true;
        while (result[0] >= ParseStatus.valid && result[1].length > 0 && cont) {
            var result2 = SEQ(result, [comma, func]);
            if (result2[0] >ParseStatus.invalid) {
                result = result2;
            } else {
                cont = false;
            }
        }
    } else if (result[0] === ParseStatus.invalid){
        result = [ParseStatus.valid, result[1]];
    }
    return result;
 }

export function paramsList(input: [ParseStatus, string]): [ParseStatus, string] {
    return CSV_1(input, paramDef);
}

export function firstValidMatchOrLongestIncomplete(input: [ParseStatus, string], funcs: Array<(input: [ParseStatus, string]) => [ParseStatus, string]>): [ParseStatus, string]
{
    var i = 0; //Index
    var result = input;
    var bestOfRest:[ParseStatus, string] = [ParseStatus.invalid, input[1]];
    do  { 
        result = funcs[i](result); 
        if (result[0] === ParseStatus.incomplete && result[1].length < bestOfRest[1].length) {
            bestOfRest = result;
        }
        i++;
    } while (result[0] !== ParseStatus.valid && i < funcs.length);
    return result[0] === ParseStatus.valid? result : bestOfRest;
}

export function LongestMatchFrom(input: [ParseStatus, string], funcs: Array<(input: [ParseStatus, string]) => [ParseStatus, string]>): [ParseStatus, string]
{   
    var bestResultSoFar: [ParseStatus, string] = [ParseStatus.invalid, input[1]];
    if (input[1].length > 0) {
        funcs.forEach(f => {
           var thisResult = f(input);
           if (thisResult[1].length < bestResultSoFar[1].length ||
            (thisResult[1].length === bestResultSoFar[1].length && thisResult[0] > bestResultSoFar[0])
            )
           {
               bestResultSoFar = thisResult;
           }
        });
    }
    return bestResultSoFar;
}

export function literalBoolean(input: [ParseStatus, string]): [ParseStatus, string] {
    var t = (input: [ParseStatus, string]) => genericString(input, "true");
    var f = (input: [ParseStatus, string]) => genericString(input, "false");
    return LongestMatchFrom(input, [t,f]);
}

export function literalInt(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^${Regexes.literalInt}`);
}

const dot = (input: [ParseStatus, string]) => singleChar(input, `.`);
const quoteS = (input: [ParseStatus, string]) => singleChar(input, `'`);
const quoteD = (input: [ParseStatus, string]) => singleChar(input, `"`);

export function literalFloat(input: [ParseStatus, string]): [ParseStatus, string] {
    return SEQ(input, [literalInt, dot, literalInt]);
}
//TODO: Unicode def?
export function literalChar(input: [ParseStatus, string]): [ParseStatus, string] {
    var ch = (input: [ParseStatus, string]) => genericRegEx(input, `^[ -~]`);//defines all printable ascii chars
    return SEQ(input, [quoteS, ch, quoteS]);
}

//TODO: Cope with escaped quotes & more characters
export function literalString(input: [ParseStatus, string]): [ParseStatus, string] {
    var content = (input: [ParseStatus, string]) => genericRegEx(input, `^[^"]*`);//anything except quote
    return SEQ(input, [quoteD, content, quoteD]);
}

export function enumValue(input: [ParseStatus, string]): [ParseStatus, string] {
    return SEQ(input, [type, dot, identifier]);
}

//TODO: scopeQualifier: (PROPERTY | GLOBAL | LIBRARY | (PACKAGE DOT namespace)) DOT; 
//Note: always optional here
export function scopeQualifier_opt(input: [ParseStatus, string]): [ParseStatus, string] {
    var prop = (input: [ParseStatus, string]) => genericString(input, "property.");
    var glob = (input: [ParseStatus, string]) => genericString(input, "global.");
    var lib = (input: [ParseStatus, string]) => genericString(input, "library.");
    //TODO package
    var result = firstValidMatchOrLongestIncomplete(input, [prop,glob,lib]);
    if (result[0] === ParseStatus.valid) {
        return result;
    } else {
       return  input;
    }
}

export function index_opt(input: [ParseStatus, string]): [ParseStatus, string] {
    var open = (input: [ParseStatus, string]) => singleChar(input,"[");
    var close = (input: [ParseStatus, string]) => singleChar(input,"]");
    var index =  (input: [ParseStatus, string]) => SEQ(input, [open, value, close]);
    return optional(input, index);
}

export function variableUse(input: [ParseStatus, string]): [ParseStatus, string] {
    return SEQ(input, [scopeQualifier_opt, identifier, index_opt]);
}

export function variableDef(input: [ParseStatus, string]): [ParseStatus, string] {
    return firstValidMatchOrLongestIncomplete(input, [identifier, deconstructedTuple, listDecomp]);
}

export function literalValue(input: [ParseStatus, string]): [ParseStatus, string] {
    if (input[0] ! > ParseStatus.incomplete && input[1].length > 0) {
      if (isMatchRegEx(input[1], /^[0-9]/)) {
        return (LongestMatchFrom(input, [literalInt, literalFloat]));
      } else if (input[1].startsWith(`'`)) {
        return literalChar(input);
      } else if (input[1].startsWith(`"`)) {
        return literalString(input);
      } else if (isMatchRegEx(input[1], /^[A-Z]/)) {
        return enumValue(input);
      } else {
        return literalBoolean(input);
      }
    } else {
        return input;
    }
}

export function literal(input: [ParseStatus, string]): [ParseStatus, string] {
    //TODO: maybe shortcut this based on starting characters
    return LongestMatchFrom(input, [literalValue, ]); //TODO literalDataStructure
}

export function value(input: [ParseStatus, string]): [ParseStatus, string] {
    return LongestMatchFrom(input, [literalValue, variableUse, variableDotMember, anythingBetweenBrackets]); 
}

export function assignableValue(input: [ParseStatus, string]): [ParseStatus, string] {
    return firstValidMatchOrLongestIncomplete(input, [variableUse, deconstructedTuple, listDecomp]); 
}

export function listDecomp(input: [ParseStatus, string]): [ParseStatus, string] {
    return SEQ(input, [openBrace, identifier, colon, identifier, closeBrace]); 
}

export function argsList(input: [ParseStatus, string]): [ParseStatus, string] {
    return CSV_1(input, value);
}

export function typesList(input: [ParseStatus, string]): [ParseStatus, string] {
    return CSV_1(input, type);
}

export function identifierList(input: [ParseStatus, string]): [ParseStatus, string] {
    return CSV_1(input, identifier);
}

export function literalList(input: [ParseStatus, string]): [ParseStatus, string] {
    throw new Error("Not implemented");
    //short circuit for starting with open brace
    //Test first for specific types of list i.e. litListString, litListInt etc
    //Maybe we should disallow literal lists except of literal values. i.e. if
    // you want to build list from expressions, need to define list and add to it.
    // Similarly for dictionaries

}

export function literalTuple(input: [ParseStatus, string]): [ParseStatus, string] {
  throw new Error("Not implemented");
}

export function literalDictionary(input: [ParseStatus, string]): [ParseStatus, string] {
    throw new Error("Not implemented");
}

export function literalDataStructure(input: [ParseStatus, string]): [ParseStatus, string] {
    return LongestMatchFrom(input, [literalString, literalList, literalTuple, literalDictionary]);
}

export function anythingToNewline(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^${Regexes.expression}`);
}

export function atLeast1CharThenToNewline(input: [ParseStatus, string]): [ParseStatus, string] {
    return genericRegEx(input, `^${Regexes.expression}`);
}

export function openBracket(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return singleChar(input, "(");
}
export function closeBracket(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return singleChar(input, ")");
}

export function openBrace(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return singleChar(input, "{");
}
export function closeBrace(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return singleChar(input, "}");
}

export function colon(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return singleChar(input, ":");
}

export function anythingBetweenBrackets(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return anythingBetweenMatching(input, "(", ")");
}
export function anythingBetweenSquareBrackets(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return anythingBetweenMatching(input, "[", "]");
}
export function anythingBetweenBraces(input: [ParseStatus, string]) :  [ParseStatus, string] {
    return anythingBetweenMatching(input, "{", "}");
}

function anythingBetweenMatching(input: [ParseStatus, string], open: string, close: string) :  [ParseStatus, string] {
    var result: [ParseStatus, string] = [ParseStatus.invalid, input[1]];
    var content = input[1];
    var unclosed = 0;
    if (content[0] === open) {
        var i = 1;
        unclosed = 1;
        while (i < content.length && unclosed > 0) {
            var char = content[i];
            if (char === close) {
                unclosed --;
            } else if (char === open) {
                unclosed ++;
            }
            i++;
        }
        if (unclosed === 0) {
            result = [ParseStatus.valid, input[1].substring(i)];
        }
    }
    return result;
}