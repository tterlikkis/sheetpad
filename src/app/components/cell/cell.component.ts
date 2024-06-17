import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Border } from 'src/app/models/border.interface';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnChanges, AfterViewInit {

  @ViewChild("input") input?: ElementRef;
  @ViewChild("cell") cell?: ElementRef;

  @Input() width: number = 80;
  @Input() height: number = 20;
  @Input() border!: Border;

  showInput: boolean = false;
  value: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngChanges')
    if ("border" in changes) {
      this.border = changes["border"].currentValue;
      this._setCellBorder();
    }
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
    if (!this.cell) return;
    const val = (b: boolean) => b ? 'solid' : 'none';
    this.cell.nativeElement.style.setProperty('--cell-border-top', val(this.border.top));
    this.cell.nativeElement.style.setProperty('--cell-border-bottom', val(this.border.bottom));
    this.cell.nativeElement.style.setProperty('--cell-border-left', val(this.border.left));
    this.cell.nativeElement.style.setProperty('--cell-border-right', val(this.border.right));
  }

  private _setCellWidth() {
    if (!this.cell) return;
    const str = `${this.width}px`
    this.cell.nativeElement.style.setProperty('--cell-width', str);
  }

  private _setCellHeight() {
    if (!this.cell) return;
    const str = `${this.height}px`
    this.cell.nativeElement.style.setProperty('--cell-height', str);
  }
}
