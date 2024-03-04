
export async function main(elanConsole) {
    var x = await elanConsole.input();
    elanConsole.print(x);
}