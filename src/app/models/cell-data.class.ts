export class CellData {
  public index: [number, number] = [0, 0];
  public text: string = "";
  public width: number = 80;
  public height: number = 20;
  constructor(index: [number, number]) {
    this.index = index;
  }
}