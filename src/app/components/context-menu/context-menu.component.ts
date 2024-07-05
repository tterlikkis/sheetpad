import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Highlight } from 'src/app/models/highlight.enum';
import { EventService } from 'src/app/services/event/event.service';
import { GridService } from 'src/app/services/grid/grid.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  colors: Highlight[] = [];

  private _sub?: Subscription;

  constructor (
    private readonly eventService: EventService,
    private readonly gridService: GridService
  ) {}

  ngOnInit(): void {
    this._consumeContextMenuEvent();
    this._getHighlightColors();
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  clickOverlay() {
    console.log('click over lay')
    const menuRef = document.getElementById('context-menu');
    const overlayRef = document.getElementById('context-overlay');
    if (!menuRef || !overlayRef) return;
    menuRef.style.display = 'none';
    overlayRef.style.display = 'none';
  }

  private _consumeContextMenuEvent() {
    this._sub = this.eventService.contextMenuEvent$.subscribe(val => {
      const menuRef = document.getElementById('context-menu');
      const overlayRef = document.getElementById('context-overlay');
      if (!menuRef || !overlayRef) return;
      menuRef.style.display = 'flex';
      menuRef.style.top = `${val.y + window.scrollY}px`;
      menuRef.style.left = `${val.x + window.scrollX}px`;
      overlayRef.style.display = 'block';
    });
  }

  private _getHighlightColors() {
    this.colors = Object.values(Highlight).filter(v => isNaN(Number(v)));
  }

  undo() {
    this.gridService.undoMostRecentChange();
    this.clickOverlay();
  }

  cut() {
    this.eventService.copy(true);
    this.clickOverlay();
  }

  copy () {
    this.eventService.copy();
    this.clickOverlay();
  }

  paste() {
    this.eventService.paste();
    this.clickOverlay();
  }

  deleteClick() {
    this.eventService.delete();
    this.clickOverlay();
  }

  selectAll() {
    this.eventService.selectAll();
    this.clickOverlay();
  }

  setHighlight(highlight: Highlight) {
    this.eventService.setHighlight(highlight);
  }
}
