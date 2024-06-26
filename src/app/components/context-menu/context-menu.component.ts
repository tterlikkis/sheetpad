import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event/event.service';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  private _sub?: Subscription;

  constructor (private readonly eventService: EventService) {}

  ngOnInit(): void {
    this._consumeContextMenuEvent();
  }

  ngOnDestroy(): void {
    this._sub?.unsubscribe();
  }

  private _consumeContextMenuEvent() {
    this._sub = this.eventService.contextMenuEvent$.subscribe(val => {
      const menuRef = document.getElementById('menu');
      if (!menuRef) return;
      menuRef.style.top = `${val.y}px`;
      menuRef.style.left = `${val.x}px`;
    });
  }
}
