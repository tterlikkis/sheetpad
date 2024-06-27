import { EventEmitter, Injectable } from '@angular/core';
import { GridService } from '../grid/grid.service';
import { Index } from '../../models/index.class';
import { Observable } from 'rxjs';
import { TauriService } from '../tauri/tauri.service';
import { SelectionPayload } from '../../models/selection-payload.class';
import { ContextMenuPayload } from 'src/app/models/context-menu-payload.interface';

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

  private readonly _contextMenuEvent: EventEmitter<ContextMenuPayload> = new EventEmitter<ContextMenuPayload>();
  public readonly contextMenuEvent$: Observable<ContextMenuPayload> = this._contextMenuEvent.asObservable();

  private readonly _dragStartEvent: EventEmitter<void> = new EventEmitter();
  public readonly dragStartEvent$: Observable<void> = this._dragStartEvent.asObservable();

  private readonly _dragEndEvent: EventEmitter<Index> = new EventEmitter<Index>();
  public readonly dragEndEvent$: Observable<Index> = this._dragEndEvent.asObservable();

  private readonly _selectionEvent: EventEmitter<SelectionPayload> = new EventEmitter<SelectionPayload>();
  public readonly selectionEvent$: Observable<SelectionPayload> = this._selectionEvent.asObservable();

  constructor(
    private readonly gridService: GridService,
    private readonly tauriService: TauriService
  ) { 
    this._consumeArrowEvents();
    this._consumeContextMenuEvent();
    this._consumeCtrlAEvent();
    this._consumeCtrlCEvent();
    this._consumeCtrlXEvent();
    this._consumeCtrlVEvent();
    this._consumeCtrlZEvent();
    this._consumeDeleteEvent();
    this._consumeEnterEvents();
    this._consumeShiftArrowEvents();
    this._consumeTabEvents();
  }

  public updateText(index: Index, text: string) {
    this.gridService.updateCellText([index], text);
  }

  private _arrowEvent(direction: 'up' | 'down' | 'left' | 'right', holdShift: boolean = false) {
    if (!this.isSelected) return;
    let newIndex = holdShift ? this._dragEnd : this._dragStart;
    switch (direction) {
      case 'up':
        if (newIndex.row > 0) newIndex.row--;
        break;
      case 'down':
        if (newIndex.row < this.gridService.rowLength - 1) newIndex.row++;
        break;
      case 'left':
        if (newIndex.col > 0) newIndex.col--;
        break;
      case 'right':
        if (newIndex.col < this.gridService.colLength - 1) newIndex.col++;
        break;
    }
    if (!holdShift) this._dragStart.set(newIndex.row, newIndex.col);
    this._dragEnd.set(newIndex.row, newIndex.col);
    this.emit();
    this._dragStartEvent.emit();
    // Need a slight delay so that the previous cell input has time to disappear
    setTimeout(() => this._dragEndEvent.emit(this._dragStart), 0);
  }


  private _consumeArrowEvents() {
    this.tauriService.arrowUpEvent$.subscribe(() => this._arrowEvent('up'));
    this.tauriService.arrowDownEvent$.subscribe(() => this._arrowEvent('down'));
    this.tauriService.arrowLeftEvent$.subscribe(() => this._arrowEvent('left'));
    this.tauriService.arrowRightEvent$.subscribe(() => this._arrowEvent('right'));
  }

  private _consumeContextMenuEvent() {
    addEventListener('contextmenu', (event) => {
      event.preventDefault();
      const payload: ContextMenuPayload = {
        x: event.clientX, y: event.clientY
      };
      this._contextMenuEvent.emit(payload);
    });
  }

  private _consumeCtrlAEvent() {
    this.tauriService.ctrlAEvent$.subscribe(() => this.selectAll());
  }

  private _consumeCtrlCEvent() {
    this.tauriService.ctrlCEvent$.subscribe(() => this.copy());
  }

  private _consumeCtrlXEvent() {
    this.tauriService.ctrlXEvent$.subscribe(() => this.copy(true));
  }

  private _consumeCtrlVEvent() {
    this.tauriService.ctrlVEvent$.subscribe(async () => this.paste());
  }

  private _consumeCtrlZEvent() {
    // Need this event listener to prevent 
    // default input element undo behavior
    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey && event.key === 'z') event.preventDefault();
    });
    this.tauriService.ctrlZEvent$.subscribe(() => {
      this.gridService.undoMostRecentChange();
    })
  }

  private _consumeDeleteEvent() {
    this.tauriService.delEvent$.subscribe(() => this.delete());
  }

  private _consumeEnterEvents() {
    this.tauriService.enterEvent$.subscribe(() => this._arrowEvent('down', false));
  }

  private _consumeShiftArrowEvents() {
    this.tauriService.shiftArrowUpEvent$.subscribe(() =>  this._arrowEvent('up', true));
    this.tauriService.shiftArrowDownEvent$.subscribe(() => this._arrowEvent('down', true));
    this.tauriService.shiftArrowLeftEvent$.subscribe(() => this._arrowEvent('left', true));
    this.tauriService.shiftArrowRightEvent$.subscribe(() => this._arrowEvent('right', true));
  }

  private _consumeTabEvents() {
    this.tauriService.tabEvent$.subscribe(() => this._arrowEvent('right', false));
  }

  public copy(isCut: boolean = false) {
    const topLeft = Index.topLeft(this._dragStart, this._dragEnd)
    const bottomRight = Index.bottomRight(this._dragStart, this._dragEnd);
    const list = Index.listBetween(topLeft, bottomRight);

    const copyText = this.gridService.readFromGrid(list);

    this.tauriService.copyToClipboard(copyText);
    if (isCut) this.gridService.updateCellText(list, '');
  }

  public delete() {
    const topLeft = Index.topLeft(this._dragStart, this._dragEnd)
    const bottomRight = Index.bottomRight(this._dragStart, this._dragEnd);
    this.gridService.clearGridSelection(Index.listBetween(topLeft, bottomRight));
  }

  public async dragStart(row: number, col: number) {
    this.isDragging = true;
    this.isSelected = false;
    this._dragStart.set(row, col);
    this._dragEnd.set(row, col);
    this.tauriService.unRegisterDelete();
    this._dragStartEvent.emit();
    this.emit();
  }

  public dragMove(row: number, col: number) {
    this._dragEnd.set(row, col);
    this.emit();
  } 

  public dragEnd() {
    this.isSelected = true;
    this.isDragging = false;
    this.tauriService.registerSelectionEvents();
    this.emit();
    this._dragEndEvent.next(this._dragStart);
  }

  private emit() {
    this._selectionEvent.emit({
      start: this._dragStart, end: this._dragEnd
    });
  }

  public async paste() {
    const text = await this.tauriService.getClipboardText();
    this.gridService.pasteToGrid(this._dragStart, text)
  }

  public selectAll() {
    this.isSelected = true;
    this.isDragging = true;
    this._dragStartEvent.emit();
    this._dragStart.set(0, 0);
    this._dragEnd.set(
      this.gridService.rowLength - 1, 
      this.gridService.colLength - 1
    );
    this._dragEndEvent.emit(this._dragStart);
    this.emit();
    this.isDragging = false;
  }

}
