import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CellData } from 'src/app/models/cell-data.class';
import { Index } from 'src/app/models/index.class';
import { EventService } from 'src/app/services/event.service';
import { GridService } from 'src/app/services/grid.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnChanges, AfterViewInit, OnDestroy {

  @ViewChild("input") input?: ElementRef;
  @ViewChild("cell") cellRef?: ElementRef;

  // I have to break it up into seperate properties so that changes are detected >:/
  @Input() index: Index = new Index();
  @Input() value: string = "";

  @Input() width: number = 80;
  @Input() height: number = 20;

  showInput: boolean = false;
  id: string = "";
  
  private _sub?: Subscription;

  constructor(private readonly eventService: EventService) {}

  ngAfterViewInit(): void {
    this.id = this.index.toString();
    this._setCellWidth();
    this._setCellHeight();
    this._consumeDragEndEvent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ("width" in changes) {
      this._setCellWidth();
    }
    if ("height" in changes) {
      this._setCellHeight();
    }
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private _consumeDragEndEvent() {
    this._sub = this.eventService.dragEndEvent$.subscribe(val => {
      if (Index.compare(val, this.index)) {
        this.showInput = true;
        setTimeout(() => this.input?.nativeElement.focus(), 0);
      }
      else { this.input?.nativeElement.blur(); }
    });
  }

  focusOut() {
    this.showInput = false;
  }

  private _setCellWidth() {
    this.cellRef?.nativeElement.style.setProperty('--cell-width', `${this.width}px`);
  }

  private _setCellHeight() {
    this.cellRef?.nativeElement.style.setProperty('--cell-height', `${this.height}px`);
  }

  valueChange(event: any) {
    this.eventService.test(this.index, event);
  }
}
