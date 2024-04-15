export class StdLib {

    asString(v: any): string {
        if (typeof v === "boolean") {
            return v ? "true" : "false";
        }

        if (typeof v === "string") {
            return v.toString();
        }

        if (typeof v === "number") {
            return v.toString();
        }

        if (Array.isArray(v)) {
            if (v.length === 0){
                return "empty List";
            }
            return `List [${v.map(i => this.asString(i)).join(", ")}]`;
        }

        if (typeof v === "object" && "asString" in v) {
            return v.asString();
        }

        if (typeof v === "object") {
            const items = Object.getOwnPropertyNames(v);
            if (items.length === 0) {
                return "empty Dictionary";
            }

            return `Dictionary [${items.map(n => `${n}:${v[n]}`).join(", ")}]`;
        }

        throw new Error("Not implemented" + typeof v);
    }

    asArray(list: Array<number>): Array<number> {
        return list;
    }

    asList(list: Array<number>): Array<number> {
        return list;
    }

    keys(dict: { [key: string]: number }): Array<string> {
        return Object.getOwnPropertyNames(dict);
    }

    values(dict: { [key: string]: number }): Array<number> {
        return this.keys(dict).map(k => dict[k]);
    }

    hasKey(dict: { [key: string]: number }, key: string): boolean {
        return this.keys(dict).includes(key);
    }

    setItem(dict: { [key: string]: number }, key: string, value : number){
        var newDict = {...dict};
        newDict[key] = value;
        return newDict;
    }

    removeItem(dict: { [key: string]: number }, key: string){
        var newDict = {...dict};
        delete newDict[key];
        return newDict;
    }

    length(coll : any){
        if (typeof coll === "string") {
            return coll.length;
        }
        if (Array.isArray(coll)) {
            return coll.length;
        }
        return this.keys(coll).length;
    }

    isBefore(s1 : string, s2 : string){
        return s1 < s2;
    }

    isAfter(s1 : string, s2 : string){
        return s1 > s2;
    }

    isAfterOrSameAs(s1 : string, s2 : string){
        return s1 > s2 || s1 === s2;
    }

    isBeforeOrSameAs(s1 : string, s2 : string){
        return s1 < s2 || s1 === s2;
    }

    first<T>(st : Array<T>){
        return st[0];
    }

    second<T>(st : Array<T>){
        return st[1];
    }
   

    pi = Math.PI;

    sin = Math.sin;

    cos = Math.cos;

    min = Math.min;

    newline = "\n";
}