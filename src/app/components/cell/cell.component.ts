import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Border } from 'src/app/models/border.interface';
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

  @Input() borderTop: boolean = false;
  @Input() borderBottom: boolean = false;
  @Input() borderLeft: boolean = false;
  @Input() borderRight: boolean = false;

  @Input() selected: boolean = false

  showInput: boolean = false;
  
  private _sub?: Subscription;

  constructor(
    private readonly eventService: EventService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngChanges')
    if (Object.keys(changes).some(key => key.includes('border'))) {
      this._setCellBorder();
    }
    if ("width" in changes) {
      this._setCellWidth();
    }
    if ("height" in changes) {
      this._setCellHeight();
    }
    if ("selected" in changes) {
      this._setSelected();
    }
  }

  ngAfterViewInit(): void {
    this._setCellBorder();
    this._setCellWidth();
    this._setCellHeight();
    this._consumeDragEndEvent();
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
    });
  }

  focusOut() {
    this.showInput = false;
  }

  private _setCellBorder() {
    if (!this.cellRef) return;
    const val = (b: boolean) => b ? 'solid' : 'none';
    this.cellRef.nativeElement.style.setProperty('--cell-border-top', val(this.borderTop));
    this.cellRef.nativeElement.style.setProperty('--cell-border-bottom', val(this.borderBottom));
    this.cellRef.nativeElement.style.setProperty('--cell-border-left', val(this.borderLeft));
    this.cellRef.nativeElement.style.setProperty('--cell-border-right', val(this.borderRight));
  }

  private _setCellWidth() {
    if (!this.cellRef) return;
    const str = `${this.width}px`
    this.cellRef.nativeElement.style.setProperty('--cell-width', str);
  }

  private _setCellHeight() {
    if (!this.cellRef) return;
    const str = `${this.height}px`
    this.cellRef.nativeElement.style.setProperty('--cell-height', str);
  }

  private _setSelected() {
    if (!this.cellRef) return;
    const str = this.selected ? '85%' : '100%';
    this.cellRef.nativeElement.style.setProperty('--cell-brightness', str);
  }

  valueChange(event: any) {
    const newText = event.target.value;
    this.eventService.test(this.index, newText);
  }
}
