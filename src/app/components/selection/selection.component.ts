import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Index } from 'src/app/models/index.class';
import { NewSelectionPayload } from 'src/app/models/new-selection-payload.class';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit, OnDestroy {

  @HostBinding('style.width.px') width: number = 0;
  @HostBinding('style.height.px') height: number = 0;

  @HostBinding('style.top.px') top: number = 0;
  @HostBinding('style.left.px') left: number = 0;

  private _sub?: Subscription;

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    this._consumeSelectionEvent();
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private _consumeSelectionEvent() {
    this._sub?.unsubscribe();
    this._sub = this.eventService.selectionEvent$.subscribe(this._drawBorders);
  }

  private _drawBorders(payload: NewSelectionPayload) {

    console.dir({
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height
    })

    const topLeft = new Index(
      Math.min(payload.start.row, payload.end.row),
      Math.min(payload.start.col, payload.end.col)
    );
    const bottomRight = new Index(
      Math.max(payload.start.row, payload.end.row),
      Math.max(payload.start.col, payload.end.col)
    );

    const topLeftBox = document.getElementById(topLeft.toString())?.getBoundingClientRect();
    const bottomRightBox = document.getElementById(bottomRight.toString())?.getBoundingClientRect();
    if (!topLeftBox || !bottomRightBox) return;
    
    const select = document.getElementById('select');
    if (!select) return;
    
    select.style.left = `${topLeftBox.x - 1}px`;
    select.style.top = `${topLeftBox.y - 1}px`;
    select.style.width = `${bottomRightBox.x + bottomRightBox.width - topLeftBox.x}px`;
    select.style.height = `${bottomRightBox.y + bottomRightBox.height - topLeftBox.y}px`;

    console.dir({
      left: this.left,
      top: this.top,
      width: this.width,
      height: this.height
    })
  }
}
