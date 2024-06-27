import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellInputWidth'
})
export class CellInputWidthPipe implements PipeTransform {
  transform(value: number): number {
    return value > 0 ? value : 1;
  }
}
