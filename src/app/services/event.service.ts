import { EventEmitter, Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { Index } from '../models/index.class';
import { StylePayload } from '../models/selection-payload.class';
import { Observable } from 'rxjs';
import { TauriService } from './tauri.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private _isDragging : boolean = false;
  public get isDragging() : boolean {
    return this._isDragging;
  }
  private set isDragging(v : boolean) {
    this._isDragging = v;
  }

  
  private _isSelected : boolean = false;
  public get isSelected() : boolean {
    return this._isSelected;
  }
  private set isSelected(v : boolean) {
    this._isSelected = v;
  }
  

  private _payload: StylePayload = new StylePayload();
  
  private readonly _dragStart: Index = new Index();
  private readonly _dragEnd: Index = new Index();

  private readonly _dragEndEvent: EventEmitter<Index> = new EventEmitter<Index>();
  public readonly dragEndEvent$: Observable<Index> = this._dragEndEvent.asObservable();


  constructor(
    private readonly gridService: GridService,
    private readonly tauriService: TauriService
  ) { 
    this._consumeCtrlCEvent();
    this._consumeCtrlXEvent();
    this._consumeCtrlVEvent();
    this._consumeDeleteEvent();
  }

  public test(index: Index, text: string) {
    this.gridService.updateCellText(index, text);
  }

  private _consumeCtrlCEvent() {
    this.tauriService.ctrlCEvent$.subscribe(() => {
      this._copySelected();
    });
  }

  private _consumeCtrlXEvent() {
    this.tauriService.ctrlXEvent$.subscribe(() => {
      this._copySelected(true);
    });
  }

  private _consumeCtrlVEvent() {
    this.tauriService.ctrlVEvent$.subscribe(async () => {
      const text = await this.tauriService.getClipboardText();
      this.gridService.pasteToGrid(this._dragStart, text)
    });
  }

  private _consumeDeleteEvent() {
    this.tauriService.delEvent$.subscribe(() => {
      this.gridService.clearGridSelection(this._payload);
    });
  }

  private _copySelected(isCut: boolean = false) {
    let copyText = "";
    const list = this._payload.wholeList();
    if (list.length === 0) return;
    let currentRow = list[0].row
    for (let i = 0; i < list.length; i++) {
      const index = list[i];
      if (currentRow !== index.row) {
        copyText += '\n';
      }
      console.log(index)
      console.log(this.gridService.grid[index.row][index.col])
      copyText += this.gridService.grid[index.row][index.col].text 
      if (i !== list.length - 1) {
        copyText += '\t';
      }
      currentRow = index.row;
    }
    console.log(copyText)
    this.tauriService.copyToClipboard(copyText);
    if (isCut) this.gridService.updateCellText(list, '');
  }

  public async dragStart(row: number, col: number) {
    this.isDragging = true;
    this.isSelected = false;
    this._dragStart.set(row, col);
    this._payload.start = this._dragStart;
    this._dragEnd.set(row, col);
    this._draw(true);
    this.tauriService.unRegisterDelete();
  }

  public dragMove(row: number, col: number) {
    this._dragEnd.set(row, col);
    this._draw(); 
  } 

  public dragEnd() {
    this.isSelected = true;
    this.isDragging = false;
    this._draw(false, true);
    this.tauriService.registerDelete();
    this._dragEndEvent.next(this._dragStart);
  }

  private calcBorders() {
    const topLeft = new Index(
      Math.min(this._dragStart.row, this._dragEnd.row), 
      Math.min(this._dragStart.col, this._dragEnd.col)
    );
    const bottomRight = new Index(
      Math.max(this._dragStart.row, this._dragEnd.row), 
      Math.max(this._dragStart.col, this._dragEnd.col)
    );
    let col = topLeft.col
    let row = topLeft.row;
    this._payload = new StylePayload(this._dragStart);

    // Left to right across the top
    for (; col <= bottomRight.col; col++) this._payload.topList.push(new Index(row, col));
    col--;

    // Down the right
    for (; row <= bottomRight.row; row++) this._payload.rightList.push(new Index(row, col));
    row--;

    // Right to left across the bottom
    for (; col >= topLeft.col; col--) this._payload.bottomList.push(new Index(row, col));
    col++;

    // Up the left
    for (; row >= topLeft.row; row--) this._payload.leftList.push(new Index(row, col));
  }

  private async _draw(dragStart: boolean = false, dragEnd: boolean = false) {
    await this.gridService.clearStyle(this._payload, dragStart);
    this.calcBorders();
    await this.gridService.draw(this._payload, dragEnd);
  }

}
