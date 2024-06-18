import { Injectable} from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';
import { CellData } from '../models/cell-data.class';
import { Index } from '../models/index.class';
import { StylePayload } from '../models/style-payload.class';

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
    this._consumeColumnChanges();
  }

  private _generateGrid() {
    let newGrid: CellData[][] = [];
    for (let i = 0; i < 5; i++) { // originally 100
      newGrid.push([]);
      for (let j = 0; j < 5; j++) { // originally 26
        newGrid[i].push(new CellData(i, j));
      }
    }
    this._grid.next(newGrid);
  }

  public async clearStyle(payload: StylePayload) {
    let newGrid = [ ...this.grid ];
    for (const index of payload.borderList()) {
      newGrid[index.row][index.col].border = {
        top: false, bottom: false, left: false, right: false
      }
    }
    this.grid = newGrid;
  }

  private _consumeColumnChanges() {
    this.columns$.subscribe(val => {
      if (val.length !== this._colLength) {
        this._colLength = val.length;
      }
    })
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

  public async draw(payload: StylePayload) {
    await this.clearStyle(payload);
    let newGrid = [ ...this.grid ];
    for (const index of payload.topList) newGrid[index.row][index.col].border.top = true;
    for (const index of payload.bottomList) newGrid[index.row][index.col].border.bottom = true;
    for (const index of payload.leftList) newGrid[index.row][index.col].border.left = true;
    for (const index of payload.rightList) newGrid[index.row][index.col].border.right = true;
  }

  public pasteToGrid(start: Index, text: string) {
    console.log('Starting paste')
    const leftMostCol = start.col;
    let row = start.row, col = start.col;
    let newGrid = [ ...this.grid ];
    for (const str of text.split('\n')) {
      for (const subStr of str.split('\t')) {
        newGrid[row][col].text = subStr;
        col++;
      }
      col = leftMostCol;
      row++;
    }
    console.log('Writing to grid')
    this.grid = newGrid;
    console.log('done')
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

  public updateCellText(cellIndexes: Index | Index[], text: string) {
    let newGrid = [ ...this.grid ];
    if (Array.isArray(cellIndexes)) {
      console.log('is array')
      for (const index of cellIndexes) {
        newGrid[index.row][index.col].text = text;
      }
    }
    else {
      newGrid[cellIndexes.row][cellIndexes.col].text = text;
    }
    this.grid = newGrid;
  }

}
