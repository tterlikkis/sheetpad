import { Component, ElementRef, HostBinding, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnChanges {

  @ViewChild("input") input?: ElementRef;
  @HostBinding("style.width.px") @Input() width!: number;
  @HostBinding("style.maxWidth.px") maxWidth!: number
  @HostBinding("style.minWidth.px") minWidth!: number;
  @HostBinding("style.height.px") @Input() height!: number;
  @HostBinding("style.maxHeight.px") maxHeight!: number;
  @HostBinding("style.minHeight.px") minHeight!: number;

  showInput: boolean = false;
  value: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    if ("width" in changes) {
      this.width = changes["width"].currentValue;
      this.maxWidth = this.width;
      this.minWidth = this.width;
    }
    if ("height" in changes) {
      this.height = changes["height"].currentValue;
      this.maxHeight = this.height;
      this.minHeight = this.height;
    }
  }

  onClick() {
    this.showInput = true;
    setTimeout(() => this.input?.nativeElement.focus(), 0);
  }

  focusOut() {
    this.showInput = false;
  }
}
