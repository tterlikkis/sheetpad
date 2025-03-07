import { EventEmitter, Injectable} from '@angular/core';
import { BehaviorSubject, Subscription, map } from 'rxjs';
import { CellData } from '../../models/cell-data.class';
import { Index } from '../../models/index.class';
import { Highlight } from 'src/app/models/highlight.enum';
import { UndoAction } from 'src/app/models/undo-action.class';

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

  private _undoActions: UndoAction[] = [];

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
    });
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
    });
  }

  public pasteToGrid(start: Index, text: string) {
    const leftMostCol = start.col;
    let row = start.row, col = start.col;
    let newGrid = [ ...this.grid ];
    this._undoActions = [];
    for (const str of text.split('\n')) {
      for (const subStr of str.split('\t')) {
        this._undoActions.push({
          index: new Index(row, col), 
          text: newGrid[row][col].text
        });
        newGrid[row][col].text = subStr;
        col++;
      }
      col = leftMostCol;
      row++;
    }
    this.grid = newGrid;
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

  public undoMostRecentChange() {
    let newGrid = [ ...this.grid ];
    let newActions: UndoAction[] = [];
    for (const action of this._undoActions) {
      let cell = newGrid[action.index.row][action.index.row];
      if (action.text) {
        newActions.push({ index: action.index, text: cell.text });
        cell.text = action.text;
      }
      else if (action.highlight) {
        newActions.push({ index: action.index, highlight: cell.highlight });
        cell.highlight = action.highlight;
      }
    }
    this._undoActions = newActions;
    this.grid = newGrid;
    this._refreshEvent.emit();
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

  public updateCellHighlight(indexes: Index[], color: Highlight) {
    let newGrid = [ ...this.grid ];
    if (indexes.length < 1) return;
    this._undoActions = [];
    for (const index of indexes) {
      this._undoActions.push({
        index: index,
        highlight: newGrid[index.row][index.col].highlight
      });
      newGrid[index.row][index.col].highlight = color;
    }
    this.grid = newGrid;
    this._refreshEvent.emit();
  }

  public updateCellText(indexes: Index[], text: string) {
    let newGrid = [ ...this.grid ];
    if (indexes.length < 1) return;
    this._undoActions = [];
    for (const index of indexes) {
      this._undoActions.push({
        index: index, 
        text: newGrid[index.row][index.col].text
      });
      newGrid[index.row][index.col].text = text;
    }
    this.grid = newGrid;
    this._refreshEvent.emit();
  }

}
