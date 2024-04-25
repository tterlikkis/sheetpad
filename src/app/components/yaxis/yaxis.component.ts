import { Component, HostBinding, HostListener } from '@angular/core';
import { GridService } from 'src/app/services/grid.service';

@Component({
  selector: 'app-yaxis',
  templateUrl: './yaxis.component.html',
  styleUrls: ['./yaxis.component.scss']
})
export class YaxisComponent {

  rows = this.gridService.rows$;
  
  @HostBinding('style.top.px') top = 0;

  constructor(private readonly gridService: GridService) {}

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    this.top = event.target.scrollingElement.scrollTop * -1; 
  }

  changeRowHeight(index: number, height: number) {
    this.gridService.updateRowHeight(index, height);
  }

}
