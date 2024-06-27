import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cellIndex'
})
export class CellIndexPipe implements PipeTransform {

  transform(value: number | string): string | number {
    if (typeof value === "number") return this.numberToString(value);
    if (typeof value === "string") return this.stringToNumber(value);
    return "";
  }

  public numberToString(index: number): string {
    if (index < 26) return String.fromCharCode(index + 65);
    let str = "";
    while (index > 0) {
      const zeroIndexBit = index < 26 ? 0 : 1;
      const base26digit = (index % 26) + 64 + zeroIndexBit;
      const char = String.fromCharCode(base26digit);
      str = char + str;
      index = Math.floor(index / 26);
    }
    return str;
  }

  public stringToNumber(indexCode: string): number {
    const regex = /[A-Z]+/g
    if (!indexCode.match(regex)) return -1;
    let pos, idx, sum = 0;
    for (pos = 0, idx = indexCode.length - 1; idx > -1; pos++, idx--) {
      const digit = indexCode.charCodeAt(idx) - 64;
      sum += digit * Math.pow(26, pos);
    }
    return sum;
  }

}
