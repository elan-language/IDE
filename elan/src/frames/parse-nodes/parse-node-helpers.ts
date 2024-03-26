import { ParseStatus } from "../parse-status";

export function matchRegEx(text: string, regx: RegExp): [ParseStatus, string, string] {
    var status = ParseStatus.invalid;
    var match = "";
    var remaining = text;
    var matches = text.match(regx);
    if (matches !== null && matches.length > 0) {
        match = matches[0];
        status = ParseStatus.valid;
        remaining = text.replace(match, "");
    }
    return [status, match, remaining];
}