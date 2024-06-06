import { ElanInputOutput } from "../../elan-input-output";
import { System } from "../../system";

export class TestInputOutput implements ElanInputOutput {
  printed: string = "";
  inputed: string = "";

  printLine(line: string): void {
    this.printed = this.printed + line;
  }
  readLine(): Promise<string> {
    return Promise.resolve(this.inputed);
  }
}

export function getTestSystem(input: string) {
  const tc = new TestInputOutput();
  tc.inputed = input;
  const system = new System(tc);
  return system;
}
