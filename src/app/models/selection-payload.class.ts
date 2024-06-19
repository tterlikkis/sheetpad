import { timeout } from "rxjs";
import { Index } from "./index.class";

export class StylePayload {
  topList:    Index[] = [];
  bottomList: Index[] = [];
  leftList:   Index[] = [];
  rightList:  Index[] = [];

  start: Index;

  constructor(start?: Index) {
    this.start = start || new Index();
  }

  borderList() {
    return [ 
      ...this.topList, 
      ...this.bottomList, 
      ...this.leftList, 
      ...this.rightList 
    ];
  }

  listWithoutStart() {
    return this.wholeList().filter(i => !Index.compare(i, this.start));
  }

  wholeList() {
    const max = Math.max(this.topList.length, this.leftList.length)
    if (max < 1) return [];
    else if (max < 2) return [ this.start ];
    
    const row = this.topList[0].row, col = this.topList[0].col;
    let result: Index[] = [];

    for (let i = row; i < row + this.leftList.length; i++) {
      for (let j = col; j < col + this.topList.length; j++) {
        result.push(new Index(i, j))
      }
    }

    return result
  }
}