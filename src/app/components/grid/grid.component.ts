import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event/event.service';
import { GridService } from 'src/app/services/grid/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, OnDestroy {
  rows = this.gridService.rows$;
  columns = this.gridService.columns$;

  grid = this.gridService.grid$;

  private _sub?: Subscription;

  constructor(
    private readonly gridService: GridService,
    private readonly eventService: EventService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._consumeRefreshEvent();
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private _consumeRefreshEvent() {
    this._sub = this.gridService.refreshEvent.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  onMouseDown(event: MouseEvent, row: number, col: number) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.button !== 2 || !this.eventService.isSelected)
      this.eventService.dragStart(row, col);
  }

  onMouseEnter(row: number, col: number) {
    if (this.eventService.isDragging)
      this.eventService.dragMove(row, col);
  }

  onMouseUp(event: MouseEvent) {
    if (event.button !== 2 || !this.eventService.isSelected)
      this.eventService.dragEnd();
  }

  // generateGrid() {
  //   for (let i = 0; i < 100; i++) {
  //     this.rows.push(new RowColumn());
  //     if (i < 26) this.columns.push(new RowColumn());
  //   }
  // }
}
