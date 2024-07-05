import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event/event.service';
import { GridService } from 'src/app/services/grid/grid.service';
import { Highlight } from 'src/app/models/highlight.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  colors: Highlight[] = [];

  private _selectedMenuId?: string;

  constructor (
    private readonly eventService: EventService,
    private readonly gridService: GridService
  ) {}

  ngOnInit(): void {
    this._getHighlightColors();
  }

  undo() {
    this.gridService.undoMostRecentChange();
    this.closeMenu();
  }

  cut() {
    this.eventService.copy(true);
    this.closeMenu();
  }

  copy () {
    this.eventService.copy();
    this.closeMenu();
  }

  openMenu(menuId: string) {
    this.closeMenu();
    this._selectedMenuId = menuId;
    const menuRef = document.getElementById(menuId);
    const overlayRef = document.getElementById('overlay');
    if (!menuRef || !overlayRef) return;
    overlayRef.style.display = 'block';
    menuRef.style.display = 'flex';
  }

  closeMenu() {
    console.log('checking id')
    if (!this._selectedMenuId) return;
    console.log('closing menu')
    const menuRef = document.getElementById(this._selectedMenuId);
    const overlayRef = document.getElementById('overlay');
    if (!menuRef || !overlayRef) return;
    console.log('found elements')
    menuRef.style.display = 'none';
    overlayRef.style.display = 'none';
  }

  paste() {
    this.eventService.paste();
    this.closeMenu();
  }

  deleteClick() {
    this.eventService.delete();
    this.closeMenu();
  }

  private _getHighlightColors() {
    this.colors = Object.values(Highlight).filter(v => isNaN(Number(v)));
  }

  selectAll() {
    this.eventService.selectAll();
    this.closeMenu();
  }

  setHighlight(highlight: Highlight) {
    this.eventService.setHighlight(highlight);
  }
} 
