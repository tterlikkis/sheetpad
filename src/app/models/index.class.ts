/** [Row][Column] */
export class Index {
  public row: number;
  public col: number;

  constructor(row: number = -1, col: number = -1) {
    this.row = row;
    this.col = col;
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

  public static compare(a: Index, b: Index): boolean {
    return a.row === b.row && a.col === b.col;
  }

  public static bottomRight(a: Index, b: Index) {
    return new Index(
      Math.max(a.row, b.row), Math.max(a.col, b.col)
    );
  }

  public static listBetween(topLeft: Index, bottomRight: Index) {
    let result: Index[] = [];
    for (let row = topLeft.row; row <= bottomRight.row; row++) {
      for (let col = topLeft.col; col <= bottomRight.col; col++) {
        result.push(new Index(row, col));
      }
    }
    return result;
  }

  public static topLeft(a: Index, b: Index) {
    return new Index(
      Math.min(a.row, b.row), Math.min(a.col, b.col)
    );
  }

}