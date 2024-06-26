import { EventEmitter, Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { Index } from '../models/index.class';
import { Observable } from 'rxjs';
import { TauriService } from './tauri.service';
import { SelectionPayload } from '../models/selection-payload.class';

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
  
  private readonly _dragStart: Index = new Index();
  private readonly _dragEnd: Index = new Index();

  private readonly _dragEndEvent: EventEmitter<Index> = new EventEmitter<Index>();
  public readonly dragEndEvent$: Observable<Index> = this._dragEndEvent.asObservable();

  private readonly _selectionEvent: EventEmitter<SelectionPayload> = new EventEmitter<SelectionPayload>();
  public readonly selectionEvent$: Observable<SelectionPayload> = this._selectionEvent.asObservable();

  constructor(
    private readonly gridService: GridService,
    private readonly tauriService: TauriService
  ) { 
    this._consumeArrowEvents();
    this._consumeCtrlCEvent();
    this._consumeCtrlXEvent();
    this._consumeCtrlVEvent();
    this._consumeDeleteEvent();
    this._consumeShiftArrowEvents();
  }

  public test(index: Index, text: string) {
    this.gridService.updateCellText(index, text);
  }

  private _arrowEvent(direction: 'up' | 'down' | 'left' | 'right', holdShift: boolean = false) {
    if (!this.isSelected) return;
    let newIndex = holdShift ? this._dragEnd : this._dragStart;
    switch (direction) {
      case 'up':
        if (newIndex.row > 0) newIndex.row--;
        break;
      case 'down':
        newIndex.row++;
        break;
      case 'left':
        if (newIndex.col > 0) newIndex.col--;
        break;
      case 'right':
        newIndex.col++;
        break;
    }
    if (!holdShift) this._dragStart.set(newIndex.row, newIndex.col);
    this._dragEnd.set(newIndex.row, newIndex.col);
    this.emit();
    this._dragEndEvent.emit(this._dragStart)
  }


  private _consumeArrowEvents() {
    this.tauriService.arrowUpEvent$.subscribe(() => this._arrowEvent('up'));
    this.tauriService.arrowDownEvent$.subscribe(() => this._arrowEvent('down'));
    this.tauriService.arrowLeftEvent$.subscribe(() => this._arrowEvent('left'));
    this.tauriService.arrowRightEvent$.subscribe(() => this._arrowEvent('right'));
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
      const topLeft = Index.topLeft(this._dragStart, this._dragEnd)
      const bottomRight = Index.bottomRight(this._dragStart, this._dragEnd);
      this.gridService.clearGridSelection(Index.listBetween(topLeft, bottomRight));
    });
  }

  private _consumeShiftArrowEvents() {
    this.tauriService.shiftArrowUpEvent$.subscribe(() =>  this._arrowEvent('up', true));
    this.tauriService.shiftArrowDownEvent$.subscribe(() => this._arrowEvent('down', true));
    this.tauriService.shiftArrowLeftEvent$.subscribe(() => this._arrowEvent('left', true));
    this.tauriService.shiftArrowRightEvent$.subscribe(() => this._arrowEvent('right', true));
  }

  private _copySelected(isCut: boolean = false) {
    let copyText = "";

    const topLeft = Index.topLeft(this._dragStart, this._dragEnd)
    const bottomRight = Index.bottomRight(this._dragStart, this._dragEnd);
    const list = Index.listBetween(topLeft, bottomRight);

    if (list.length === 0) return;
    let currentRow = list[0].row
    for (let i = 0; i < list.length; i++) {
      const index = list[i];
      if (currentRow !== index.row) {
        copyText += '\n';
      }
      copyText += this.gridService.grid[index.row][index.col].text 
      if (i !== list.length - 1) {
        copyText += '\t';
      }
      currentRow = index.row;
    }

    this.tauriService.copyToClipboard(copyText);
    if (isCut) this.gridService.updateCellText(list, '');
  }

  public async dragStart(row: number, col: number) {
    this.isDragging = true;
    this.isSelected = false;
    this._dragStart.set(row, col);
    this._dragEnd.set(row, col);
    this.emit();
    this.tauriService.unRegisterDelete();
  }

  public dragMove(row: number, col: number) {
    this._dragEnd.set(row, col);
    this.emit();
  } 

  public dragEnd() {
    this.isSelected = true;
    this.isDragging = false;
    this.tauriService.registerDelete();
    this.emit();
    this._dragEndEvent.next(this._dragStart);
  }

  private emit() {
    this._selectionEvent.emit({
      start: this._dragStart, end: this._dragEnd
    });
  }

}
