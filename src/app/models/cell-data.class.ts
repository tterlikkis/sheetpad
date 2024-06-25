import { Border } from "./border.interface";
import { Index } from "./index.class";

export class CellData {
  public index: Index;
  public text: string = "";
  public width: number = 80;
  public height: number = 20;

  constructor(row: number = -1, col: number = -1) {
    this.index = new Index(row, col);
  }
}