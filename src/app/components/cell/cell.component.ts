import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Border } from 'src/app/models/border.interface';
import { CellData } from 'src/app/models/cell-data.class';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnChanges, AfterViewInit {

  @ViewChild("input") input?: ElementRef;
  @ViewChild("cell") cellRef?: ElementRef;

  @Input() width: number = 80;
  @Input() height: number = 20;
  border!: Border;

  // I have to break it up into seperate booleans so that changes
  // are detected by ngChanges
  @Input() borderTop = false;
  @Input() borderBottom = false;
  @Input() borderLeft = false;
  @Input() borderRight = false;

  showInput: boolean = false;
  value: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    this._setCellBorder();
    if ("width" in changes) {
      this.width = changes["width"].currentValue;
      this._setCellWidth();
    }
    if ("height" in changes) {
      this.height = changes["height"].currentValue;
      this._setCellHeight();
    }
  }

  ngAfterViewInit(): void {
    this._setCellBorder();
    this._setCellWidth();
    this._setCellHeight();
  }

  onClick() {
    this.showInput = true;
    setTimeout(() => this.input?.nativeElement.focus(), 0);
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
}
