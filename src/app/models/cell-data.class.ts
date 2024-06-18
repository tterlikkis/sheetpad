import { Border } from "./border.interface";
import { Index } from "./index.class";

export class CellData {
  public index: Index;
  public text: string = "";
  public width: number = 80;
  public height: number = 20;
  public border: Border = {
    top: false, bottom: false, left: false, right: false
  }
  public selected: boolean = false;
  public background: string = "transparent";
  constructor(row: number = -1, col: number = -1) {
    this.index = new Index(row, col);
  }
}