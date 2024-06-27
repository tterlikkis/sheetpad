import { EventEmitter, Injectable} from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';
import { CellData } from '../../models/cell-data.class';
import { Index } from '../../models/index.class';

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

  // Have to send event to grid component to cdr.detectChanges()
  // because for some reason changing cell text doesn't actually
  // trigger Angular change detection until you wiggle the mouse
  // or switch focus to a new window.
  private readonly _refreshEvent = new EventEmitter<void>();
  public readonly refreshEvent = this._refreshEvent.asObservable();

  private _undoIndexes: Index[] = [];
  private _undoText: string = "";
  private _undoIsPaste: boolean = false;

  constructor() {
    this._generateGrid();
    this._consumeRowChanges();
    this._consumeColumnChanges();
  }

  private _generateGrid() {
    let newGrid: CellData[][] = [];
    for (let i = 0; i < 100; i++) { // originally 100
      newGrid.push([]);
      for (let j = 0; j < 26; j++) { // originally 26
        newGrid[i].push(new CellData(i, j));
      }
    }
    this._grid.next(newGrid);
  }

  public clearGridSelection(list: Index[]) {
    let newGrid = [ ...this.grid ];
    for (const index of list) {
      newGrid[index.row][index.col].text = "";
    }
    this.grid = newGrid;
    this._refreshEvent.emit();
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

  public pasteToGrid(start: Index, text: string) {
    const leftMostCol = start.col;
    let row = start.row, col = start.col;
    let newGrid = [ ...this.grid ];
    let indexes = [];
    for (const str of text.split('\n')) {
      for (const subStr of str.split('\t')) {
        newGrid[row][col].text = subStr;
        indexes.push(new Index(row, col));
        col++;
      }
      col = leftMostCol;
      row++;
    }
    this.grid = newGrid;
    this._undoIndexes = indexes;
    this._undoText = text;
    this._undoIsPaste = true;
    this._refreshEvent.emit();
  }

  public readFromGrid(indexes: Index[]) {
    let result = ""
    if (indexes.length > 0) {
      let currentRow = indexes[0].row
      for (let i = 0; i < indexes.length; i++) {
        const index = indexes[i];
        if (currentRow !== index.row) {
          result += '\n';
        }
        result += this.grid[index.row][index.col].text 
        if (i !== indexes.length - 1) {
          result += '\t';
        }
        currentRow = index.row;
      }
    }
    return result;
  }

  private _undoAction(indexes: Index[], text: string, isPaste: boolean) {
    this._undoIndexes = indexes;
    this._undoText = text;
    this._undoIsPaste = isPaste;
  }

  public undoMostRecentChange() {
    if (this._undoIndexes.length < 1) return;
    const tempText = this._undoText;
    this._undoText = this.readFromGrid(this._undoIndexes);
    if (this._undoIsPaste) this.pasteToGrid(this._undoIndexes[0], tempText);
    else this.updateCellText(this._undoIndexes, tempText);
    console.log(this._undoText)
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

  public updateCellText(cellIndexes: Index[], text: string) {
    let newGrid = [ ...this.grid ];
    if (cellIndexes.length < 1) return;
    this._undoAction(
      cellIndexes,
      this.readFromGrid(cellIndexes),
      false
    );
    for (const index of cellIndexes) {
      newGrid[index.row][index.col].text = text;
    }
    this.grid = newGrid;
  }

}
