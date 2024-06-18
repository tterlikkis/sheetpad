import { Index } from "./index.class";

export class BorderPayload {
  topList:    Index[] = [];
  bottomList: Index[] = [];
  leftList:   Index[] = [];
  rightList:  Index[] = [];

  start: Index;

  constructor(start?: Index) {
    this.start = start || new Index();
  }

  toList() {
    return [ 
      ...this.topList, 
      ...this.bottomList, 
      ...this.leftList, 
      ...this.rightList 
    ];
  }
}