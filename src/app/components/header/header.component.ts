import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() type: "column" | "row" = "column";
  @Input() content: string = "A"

  @Output() onResize = new EventEmitter<number>();

  @ViewChild("bar") bar!: ElementRef;
  @ViewChild("header") header!: ElementRef;

  width: string = '80px';
  barPosition: number = -1;
  dragFunction!: Function;
  isColumn: boolean = true;
  zoneClass: string = "column-zone";
  barClass: string = "column-bar";

  ngOnInit(): void {
    this.isColumn = this.type === "column";
    this.dragFunction = this.isColumn ? this._columnDrag : this._rowDrag;
    this.zoneClass = this.isColumn ? "column-zone" : "row-zone";
    this.barClass = this.isColumn ? "column-bar" : "row-bar";
    this.width = this.isColumn ? '80px' : '100%'; 
  }
  
  private _columnDrag(event: MouseEvent) {
    event.preventDefault();
    const rect = this.header.nativeElement.getBoundingClientRect();
    this.bar.nativeElement.style.display = 'block';
    this.bar.nativeElement.style.top = `${rect.top}px`;
    this.bar.nativeElement.style.left = `${event.clientX}px`;
    const duringDrag = (event: MouseEvent) => {
      if (rect.left < event.clientX)
        this.bar.nativeElement.style.left = `${event.clientX}px`;
    }

    const finishDrag = (event: MouseEvent) => {
      const width = event.clientX - rect.left;
      this.bar.nativeElement.style.display = 'none';
      this.header.nativeElement.style.width = `${width}px`;
      this.onResize.emit(width);
      document.removeEventListener('mousemove', duringDrag);
      document.removeEventListener('mouseup', finishDrag);
    }

    document.addEventListener('mousemove', duringDrag);
    document.addEventListener('mouseup', finishDrag);
  }

  private _rowDrag(event: MouseEvent) {
    event.preventDefault();
    const rect = this.header.nativeElement.getBoundingClientRect();
    this.bar.nativeElement.style.display = 'block';
    this.bar.nativeElement.style.top = `${event.clientY}px`;
    this.bar.nativeElement.style.left = `${rect.left}px`;
    console.log(event)
    console.log(event.clientY)
    const duringDrag = (event: MouseEvent) => {
      if (rect.top < event.clientY)
        this.bar.nativeElement.style.top = `${event.clientY}px`;
    }

    const finishDrag = (event: MouseEvent) => {
      const height = event.clientY - rect.top;
      this.bar.nativeElement.style.display = 'none';
      this.header.nativeElement.style.height = `${height}px`;
      this.onResize.emit(height);
      document.removeEventListener('mousemove', duringDrag);
      document.removeEventListener('mouseup', finishDrag);
    }

    document.addEventListener('mousemove', duringDrag);
    document.addEventListener('mouseup', finishDrag);
  }
}
