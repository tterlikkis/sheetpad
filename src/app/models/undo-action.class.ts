import { Highlight } from "./highlight.enum";
import { Index } from "./index.class";

export interface UndoAction {
  index: Index;
  text?: string;
  highlight?: Highlight;
}