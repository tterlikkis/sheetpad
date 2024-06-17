import { Injectable } from '@angular/core';
import { GridService } from './grid.service';

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
  
  private _dragStart: [number, number] = [-1, -1];
  private _dragEnd: [number, number] = [-1, -1];
  constructor(private readonly gridService: GridService) { }

  public dragStart(row: number, col: number) {
    this.isDragging = true;
    this._dragStart = [row, col];
    this._dragEnd = [row, col];
    this._draw();
  }

  public dragMove(row: number, col: number) {
    this._dragEnd = [row, col];
    this._draw();
  } 

  public dragEnd(row: number, col: number) {
    this.isDragging = false;
    this._dragEnd = [row, col];
  }

  private _draw() {
    this.gridService.drawBorders(this._dragStart, this._dragEnd);
  }


}
