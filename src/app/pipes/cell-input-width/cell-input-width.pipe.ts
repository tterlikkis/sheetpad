import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellInputWidth'
})
export class CellInputWidthPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): number {
    return typeof value === "number" && value > 0 ? value : 1;
  }

}
