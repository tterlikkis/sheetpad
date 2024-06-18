import { Injectable } from '@angular/core';
import { GridService } from './grid.service';
import { Index } from '../models/index.class';
import { BorderPayload } from '../models/border-payload.class';

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

  private _payload: BorderPayload = new BorderPayload();
  
  private _dragStart: Index = new Index();
  private _dragEnd: Index = new Index();
  constructor(private readonly gridService: GridService) { }

  public async dragStart(row: number, col: number) {
    this.isDragging = true;
    this._dragStart.set(row, col);
    this._dragEnd.set(row, col);
    this._draw();
  }

  public dragMove(row: number, col: number) {
    this._dragEnd.set(row, col);
    this._draw(); 
  } 

  public dragEnd(row: number, col: number) {
    this.isDragging = false;
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
    this._payload = new BorderPayload();

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

  private async _draw() {
    await this.gridService.clearBorders(this._payload.toList());
    this.calcBorders();
    await this.gridService.drawBorders(this._payload);
  }

}
