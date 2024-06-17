import { Injectable} from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';
import { CellData } from '../models/cell-data.class';

@Injectable({
  providedIn: 'root'
})
export class GridService {

  // [Row][Column]
  private readonly _grid = new BehaviorSubject<CellData[][]>([]);
  public readonly grid$ = this._grid.asObservable();
  public get grid(): CellData[][] {
    return this._grid.value;
  }
  private set grid(v : CellData[][]) {
    this._grid.next(v);
  }

  public readonly rows$ = this._grid.pipe(map(grid => grid.map(row => row[0])));
  public readonly columns$ = this._grid.pipe(map(grid => grid[0]));

  private _rowLength : number = 1;
  public get rowLength() : number {
    return this._rowLength;
  }
  private set rowLength(v : number) {
    this._rowLength = v;
  }
  
  private _colLength : number = 1;
  public get colLength() : number {
    return this._colLength;
  }
  public set colLength(v : number) {
    this._colLength = v;
  }

  constructor() {
    this._generateGrid();
    this._consumeRowChanges();
  }

  private _generateGrid() {
    let newGrid: CellData[][] = [];
    for (let i = 0; i < 20; i++) { // originally 100
      newGrid.push([]);
      for (let j = 0; j < 5; j++) { // originally 26
        newGrid[i].push(new CellData([i, j]));
      }
    }
    this._grid.next(newGrid);
  }


  private _consumeRowChanges() {
    this.rows$.subscribe(val => {
      if (val.length !== this._rowLength) {
        if (val.length.toString().length !== this._rowLength.toString().length) {
          const width = 20 + 8 * (val.length.toString().length - 1);
          const r = document.querySelector(':root');
          (r as any).style.setProperty('--y-axis-width', `${width}px`);
        }
        this._rowLength = val.length;
      }
    })
  }

  public drawBorders(start: [number, number], end: [number, number]) {
    const topLeft = [Math.min(start[0], end[0]), Math.min(start[1], end[1])];
    const bottomRight = [Math.max(start[0], end[0]), Math.max(start[1], end[1])];
    let col = topLeft[1]
    let row = topLeft[0];
    console.log('Top Left', topLeft);
    console.log('Bottom Right', bottomRight)
    let newGrid = [ ...this.grid ];

    // Left to right across the top
    for (; col <= bottomRight[1]; col++) {
      newGrid[row][col].border.top = true;
    }
    col--;

    // Down the right
    for (; row <= bottomRight[0]; row++) {
      newGrid[row][col].border.right = true;
    }
    row--;

    // Right to left across the bottom
    for (; col >= topLeft[1]; col--) {
      newGrid[row][col].border.bottom = true;
    }
    col++;

    // Up the left
    for (; row >= topLeft[0]; row--) {
      newGrid[row][col].border.left = true;
    }

    this.grid = newGrid;
  }

  public updateColumnWidth(index: number, width: number) {
    let newGrid = [ ...this.grid ];
    for (let i = 0; i < this.rowLength; i++) {
      newGrid[i][index].width = width;
    }
    this.grid = newGrid;
  }

  public updateRowHeight(index: number, height: number) {
    let newGrid = [ ...this.grid ];
    for (let i = 0; i < this.colLength; i++) {
      newGrid[index][i].height = height;
    }
    this.grid = newGrid;
  }

  public updateCell(cellIndex: [number, number], text: string) {
    let newGrid = [ ...this.grid ];
    newGrid[cellIndex[0]][cellIndex[1]].text = text;
    this.grid = newGrid;
  }

}
