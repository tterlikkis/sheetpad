import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Corner } from 'src/app/models/corner.enum';
import { Index } from 'src/app/models/index.class';
import { SelectionPayload } from 'src/app/models/selection-payload.class';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss']
})
export class SelectionComponent implements OnInit, OnDestroy {

  private _sub?: Subscription;

  // Scroll Offsets
  private X: number = 0;
  private Y: number = 0;

  constructor(private readonly eventService: EventService) {}

  ngOnInit(): void {
    this._consumeSelectionEvent();
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  @HostListener('window:scroll', [])
  onResize() {
    this.X = window.scrollX;
    this.Y = window.scrollY;
  }

  private _addScrollOffset(rect?: DOMRect) {
    return new DOMRect(
      (rect?.x || 0) + this.X/2,
      (rect?.y || 0) + this.Y/2,
      rect?.width || 0,
      rect?.height || 0
    );
  }

  private _consumeSelectionEvent() {
    this._sub?.unsubscribe();
    this._sub = this.eventService.selectionEvent$.subscribe(payload => this._drawSelection(payload));
  }

  private _checkCorner(start: Index, topLeft: Index, bottomRight: Index): Corner | undefined {
    if (Index.compare(start, topLeft)) return Corner.TopLeft;
    if (Index.compare(start, bottomRight)) return Corner.BottomRight;
    if (start.col === bottomRight.col && start.row === topLeft.row) return Corner.TopRight;
    if (start.col === topLeft.col && start.row === bottomRight.row) return Corner.BottomLeft;
    return undefined;
  }

  private _drawSelection(payload: SelectionPayload) {
    const topLeft = Index.topLeft(payload.start, payload.end);
    const bottomRight = Index.bottomRight(payload.start, payload.end);

    const startBox = this._addScrollOffset(
      document.getElementById(payload.start.toString())?.getBoundingClientRect()
    );
    const topLeftBox = this._addScrollOffset(
      document.getElementById(topLeft.toString())?.getBoundingClientRect()
    );
    const bottomRightBox = this._addScrollOffset(
      document.getElementById(bottomRight.toString())?.getBoundingClientRect()
    );
    const border = document.getElementById('border-area');
    const grey = document.getElementById('grey-area');

    if (!startBox || !topLeftBox || !bottomRightBox || !border || !grey) return;
    
    const box = this._addScrollOffset(new DOMRect(
      topLeftBox.x - 1, 
      topLeftBox.y - 1,
      bottomRightBox.x + bottomRightBox.width - topLeftBox.x,
      bottomRightBox.y + bottomRightBox.height - topLeftBox.y
    ))
    
    border.style.left = `${box.x}px`;
    border.style.top = `${box.y}px`;
    border.style.width = `${box.width}px`;
    border.style.height = `${box.height}px`;
    
    if (!Index.compare(payload.start, payload.end)) {
      const corner = this._checkCorner(payload.start, topLeft, bottomRight);
      if (corner === undefined) return;
      grey.style.top = `${box.y}px`;
      grey.style.left = `${box.x}px`;
      grey.style.width = `${box.width}px`;
      grey.style.height = `${box.height}px`;
      grey.style.clipPath = this._getClipPath(box, startBox, corner)
    }
    else {
      grey.style.clipPath = 'none';
      grey.style.width = grey.style.height = '0px';
    }

  }

  private _getClipPath(box: DOMRect, start: DOMRect, corner: Corner) {
    let result: [number, number][];
    switch (corner) {
      case Corner.TopLeft:
        result = [
          [start.width, 0],
          [box.width, 0],
          [box.width, box.height],
          [0, box.height],
          [0, start.height],
          [start.width, start.height]
        ];
        break;
      case Corner.TopRight:
        result = [
          [0, 0],
          [box.width-start.width, 0],
          [box.width-start.width, start.height],
          [box.width, start.height],
          [box.width, box.height],
          [0, box.height]
        ];
        break;
      case Corner.BottomLeft:
        result = [
          [0, 0],
          [box.width, 0],
          [box.width, box.height],
          [start.width, box.height],
          [start.width, box.height-start.height],
          [0, box.height-start.height]
        ];
        break;
      case Corner.BottomRight:
        result = [
          [0, 0],
          [box.width, 0],
          [box.width, box.height-start.height],
          [box.width-start.width, box.height- start.height],
          [box.width-start.width, box.height],
          [0, box.height]
        ];
        break;
      default:
        result = [];
        break;
    }
    return result.reduce((acc, curr, idx) => {
      if (idx !== 0) acc += ', ';
      return acc + `${curr[0]}px ${curr[1]}px`;
    }, "polygon(") + ')';
  }

}

