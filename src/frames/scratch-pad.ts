import { Frame } from "./interfaces/frame";

export class ScratchPad {
  private frames: Frame[] | undefined;

  addSnippet(frames: Frame[]): void {
    this.frames = frames;
  }
  readFrames(): Frame[] | undefined {
    const toPaste = this.frames;
    return toPaste;
  }

  remove(frames: Frame[]) {
    if (this.frames === frames) {
      this.frames = undefined;
    }
  }
}
