import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { YaxisComponent } from './components/yaxis/yaxis.component';
import { XaxisComponent } from './components/xaxis/xaxis.component';
import { CellIndexPipe } from './pipes/cell-index/cell-index.pipe';
import { CellComponent } from './components/cell/cell.component';
import { FormsModule } from '@angular/forms';
import { CellInputWidthPipe } from './pipes/cell-input-width/cell-input-width.pipe';
import { GridComponent } from './components/grid/grid.component';
import { HeaderComponent } from './components/header/header.component';
import { SelectionComponent } from './components/selection/selection.component';

@NgModule({
  declarations: [
    AppComponent,
    YaxisComponent,
    XaxisComponent,
    CellIndexPipe,
    CellComponent,
    CellInputWidthPipe,
    GridComponent,
    HeaderComponent,
    SelectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
