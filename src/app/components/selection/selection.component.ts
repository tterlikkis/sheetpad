import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Corner } from 'src/app/models/corner.enum';
import { Index } from 'src/app/models/index.class';
import { NewSelectionPayload } from 'src/app/models/new-selection-payload.class';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit, OnDestroy {

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

  private _checkCorner(start: Index, topLeft: Index, bottomRight: Index): Corner | undefined {
    if (Index.compare(start, topLeft)) return Corner.TopLeft;
    if (Index.compare(start, bottomRight)) return Corner.BottomRight;
    if (start.row === topLeft.row) return Corner.TopLeft
    if (start.col === bottomRight.col) return Corner.BottomRight;
    return undefined;
  }

  private _drawBorders(payload: NewSelectionPayload) {
    const topLeft = new Index(
      Math.min(payload.start.row, payload.end.row),
      Math.min(payload.start.col, payload.end.col)
    );
    const bottomRight = new Index(
      Math.max(payload.start.row, payload.end.row),
      Math.max(payload.start.col, payload.end.col)
    );

    const startBox = document.getElementById(payload.start.toString())?.getBoundingClientRect();
    const topLeftBox = document.getElementById(topLeft.toString())?.getBoundingClientRect();
    const bottomRightBox = document.getElementById(bottomRight.toString())?.getBoundingClientRect();
    if (!startBox || !topLeftBox || !bottomRightBox) return;
    
    const select = document.getElementById('select');
    const white = document.getElementById('white-area');
    if (!select || !white) return;

    const left = topLeftBox.x - 1;
    const top = topLeftBox.y - 1;
    const width = bottomRightBox.x + bottomRightBox.width - topLeftBox.x
    const height = bottomRightBox.y + bottomRightBox.height - topLeftBox.y;
    
    select.style.left = `${left}px`;
    select.style.top = `${top}px`;
    select.style.width = `${width}px`;
    select.style.height = `${height}px`;
    
    if (payload.isEnd) {
      const corner = 
      select.style.backgroundColor = 'rgb(0, 0, 0, 0.1)';
      white.style.top = `${startBox.top - top - 2}px`;
      white.style.left = `${startBox.left - left - 2}px`;
      white.style.width = `${startBox.width - 2}px`;
      white.style.height = `${startBox.height - 2}px`;
    }
    else {
      select.style.backgroundColor = 'transparent';
      white.style.width = white.style.height = '0px';
    }

    // const tl = [startBox.left, startBox.top];
    // const tr = [startBox.left + startBox.width, startBox.top];
    // const bl = [startBox.left, startBox.top + startBox.height];
    // const br = [startBox.left + startBox.width, startBox.top + startBox.height];
    // white.style.clipPath = `polygon(${tl[0]}px ${tl[1]}px, ${tr[0]} ${tr[1]}, ${br[0]} ${br[1]}, ${bl[0]} ${bl[1]});`

  }

  private _getCornerPxOffset(prop: string, corner?: Corner) {
    switch (corner) {
      case Corner.TopLeft: return 2;
      case Corner.BottomRight: return 3;
      case Corner.TopRight:
        return prop === 'width' || prop === 'left' ? 3 : 2;
      case Corner.BottomLeft:
        return prop === 'height' || prop === 'top' ? 3 : 2;
      default: return 0;
    }
  }
}

