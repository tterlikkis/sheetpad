import { Index } from "./index.class";

export class BorderPayload {
  topList:    Index[] = [];
  bottomList: Index[] = [];
  leftList:   Index[] = [];
  rightList:  Index[] = [];

  constructor() {}

  toList() {
    return [ 
      ...this.topList, 
      ...this.bottomList, 
      ...this.leftList, 
      ...this.rightList 
    ];
  }
}