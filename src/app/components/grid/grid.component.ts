import { Component, OnInit } from '@angular/core';
import { RowColumn } from 'src/app/models/row-column.class';
import { GridService } from 'src/app/services/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {
  rows = this.gridService.rows$;
  columns = this.gridService.columns$;

  constructor(private readonly gridService: GridService) {}

  ngOnInit(): void {
    // this.generateGrid();
  }

  // generateGrid() {
  //   for (let i = 0; i < 100; i++) {
  //     this.rows.push(new RowColumn());
  //     if (i < 26) this.columns.push(new RowColumn());
  //   }
  // }
}
