import { Component, OnInit } from '@angular/core';
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
    private readonly eventService: EventService
  ) {}

  ngOnInit(): void {
    // this.generateGrid();
    this.grid.subscribe((val) => {
      console.log('got a new grid')
      console.log(val.flatMap(row => row.map(cell => cell.border)))
    })
  }

  onMouseDown(event: MouseEvent, row: number, col: number) {
    console.log(`Mousedown ${row} ${col}`);
    event.preventDefault();
    event.stopImmediatePropagation();
    this.eventService.dragStart(row, col);
  }

  onMouseEnter(event: MouseEvent, row: number, col: number) {
    // console.log(`Mouseenter ${row} ${col}`);
    if (!this.eventService.isDragging) return;
    this.eventService.dragMove(row, col);
  }

  onMouseUp(event: MouseEvent, row: number, col: number) {
    console.log(`Mouseup ${row} ${col}`);
    this.eventService.dragEnd(row, col);
  }

  // generateGrid() {
  //   for (let i = 0; i < 100; i++) {
  //     this.rows.push(new RowColumn());
  //     if (i < 26) this.columns.push(new RowColumn());
  //   }
  // }
}
