import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event/event.service';
import { GridService } from 'src/app/services/grid/grid.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  private _sub?: Subscription;

  constructor (
    private readonly eventService: EventService,
    private readonly gridService: GridService
  ) {}

  ngOnInit(): void {
    this._consumeContextMenuEvent();
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  clickOverlay() {
    const menuRef = document.getElementById('menu');
    const overlayRef = document.getElementById('overlay');
    if (!menuRef || !overlayRef) return;
    menuRef.style.display = 'none';
    overlayRef.style.display = 'none';
  }

  private _consumeContextMenuEvent() {
    this._sub = this.eventService.contextMenuEvent$.subscribe(val => {
      const menuRef = document.getElementById('menu');
      const overlayRef = document.getElementById('overlay');
      if (!menuRef || !overlayRef) return;
      menuRef.style.display = 'flex';
      menuRef.style.top = `${val.y}px`;
      menuRef.style.left = `${val.x}px`;
      overlayRef.style.display = 'block';
    });
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
}
