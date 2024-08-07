export interface editorEvent {
  type: "click" | "dblclick" | "key";
  target: "frame" | "window";
  key?: string;
  modKey: { control: boolean; shift: boolean; alt: boolean };
  id?: string;
  selection?: number;
  autocomplete?: string;
}
