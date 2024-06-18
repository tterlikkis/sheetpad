import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RowColumn } from 'src/app/models/row-column.class';
import { EventService } from 'src/app/services/event.service';
import { GridService } from 'src/app/services/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  rows = this.gridService.rows$;
  columns = this.gridService.columns$;

  grid = this.gridService.grid$;

  constructor(
    private readonly gridService: GridService,
    private readonly eventService: EventService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
  }

  onMouseDown(event: MouseEvent, row: number, col: number) {
    event.preventDefault();
    event.stopImmediatePropagation();
    this.eventService.dragStart(row, col);
  }

  onMouseEnter(row: number, col: number) {
    if (!this.eventService.isDragging) return;
    this.eventService.dragMove(row, col);
  }

  onMouseUp() {
    this.eventService.dragEnd();
  }

  // generateGrid() {
  //   for (let i = 0; i < 100; i++) {
  //     this.rows.push(new RowColumn());
  //     if (i < 26) this.columns.push(new RowColumn());
  //   }
  // }
}
