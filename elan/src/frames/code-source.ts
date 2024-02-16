import { Regexes } from "./fields/regexes";

export interface CodeSource {
    removeNewLine(): CodeSource;
    removeIndent(): CodeSource;
    isMatch(code: string): boolean;
    isMatchRegEx(regx: RegExp): boolean;
    remove(code: string): CodeSource;
    removeRegEx(regx: RegExp, optionally: boolean): string;
    hasMoreCode(): boolean;
    getRemainingCode(): string;
}

export class CodeSourceFromString implements CodeSource {
    private remainingCode: string;

    constructor(code: string) {
        this.remainingCode = code;
    }
    removeNewLine(): CodeSource {
        this.removeRegEx(Regexes.startsWithNewLine, false);
        return this;
    }
    removeIndent(): CodeSource {
        var indent = /^\s*/;
        this.removeRegEx(indent, false);
        return this;
    }
    remove(match: string): CodeSource {
        if (!this.isMatch(match)) {
            throw new Error(`code does not match ${match} - can check by calling 'isMatch' first`);
        }
        this.remainingCode = this.remainingCode.substring(match.length);
        return this;
    }
    removeRegEx(regx: RegExp, optional: boolean): string {
        if (!this.isMatchRegEx(regx)) {
            if (optional){
                return "";
            } else {
                throw new Error(`Code does not match ${regx}`);
            }
        } else {
            var match = this.remainingCode.match(regx)![0];
            this.remainingCode = this.remainingCode.replace(regx,"");
            return match;
        }
    }
    isMatch(code: string): boolean {
        return this.remainingCode.startsWith(code);
    }
    isMatchRegEx(regEx: RegExp): boolean {
        var matches = this.remainingCode.match(regEx);
        return matches !== null && matches.length > 0;
    }
    hasMoreCode(): boolean {
        return this.remainingCode.length > 0;
    }
    getRemainingCode(): string {
        return this.remainingCode;
    }
}
