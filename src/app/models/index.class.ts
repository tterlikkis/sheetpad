/** [Row][Column] */
export class Index {
  public row: number;
  public col: number;

  constructor(row: number = -1, col: number = -1) {
    this.row = row;
    this.col = col;
  }

  public static compare(a: Index, b: Index): boolean {
    return a.row === b.row && a.col === b.col;
  }

  public pair(): [number, number] {
    return [this.row, this.col]
  }

  public set(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  public toString() {
    return `[${this.row}, ${this.col}]`;
  }

}