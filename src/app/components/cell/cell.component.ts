import { AfterViewInit, Component, ElementRef, HostBinding, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnChanges, AfterViewInit {

  @ViewChild("input") input?: ElementRef;
  @ViewChild("cell") cell?: ElementRef;

  @Input() width: number = 80;
  @Input() height: number = 20

  showInput: boolean = false;
  value: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    if ("width" in changes) {
      this.width = changes["width"].currentValue;
      this._setCellWidth()
    }
    if ("height" in changes) {
      this.height = changes["height"].currentValue;
      this._setCellHeight();
    }
  }

  ngAfterViewInit(): void {
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

  private _setCellWidth() {
    if (!this.cell) return;
    const str = `${this.width}px`
    this.cell.nativeElement.style.width = str;
    this.cell.nativeElement.style.maxWidth = str;
    this.cell.nativeElement.style.minWidth = str;
  }

  private _setCellHeight() {
    if (!this.cell) return;
    const str = `${this.height}px`
    this.cell.nativeElement.style.height = str;
    this.cell.nativeElement.style.maxHeight = str;
    this.cell.nativeElement.style.minHeight = str;
  }
}
