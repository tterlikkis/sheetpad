import { Component, HostBinding, HostListener } from '@angular/core';
import { GridService } from 'src/app/services/grid/grid.service';

@Component({
  selector: 'app-xaxis',
  templateUrl: './xaxis.component.html',
  styleUrls: ['./xaxis.component.scss']
})
export class XaxisComponent {

  columns = this.gridService.columns$;

  @HostBinding('style.left.px') left = 0;

  constructor(private readonly gridService: GridService) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.left = event.target.scrollingElement.scrollLeft * -1;
  }

  changeColumnWidth(index: number, width: number) {
    this.gridService.updateColumnWidth(index, width);
  }

}
