import { EventEmitter, Injectable } from '@angular/core';
import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut';
import { listen } from '@tauri-apps/api/event';
import { readText, writeText } from '@tauri-apps/api/clipboard';
import { Indexable } from '../../models/indexable.interface';

@Injectable({
  providedIn: 'root'
})
export class TauriService {

  private readonly _arrowUpEvent = new EventEmitter();
  public readonly arrowUpEvent$ = this._arrowUpEvent.asObservable();

  private readonly _arrowDownEvent = new EventEmitter();
  public readonly arrowDownEvent$ = this._arrowDownEvent.asObservable();

  private readonly _arrowLeftEvent = new EventEmitter();
  public readonly arrowLeftEvent$ = this._arrowLeftEvent.asObservable();

  private readonly _arrowRightEvent = new EventEmitter();
  public readonly arrowRightEvent$ = this._arrowRightEvent.asObservable();

  private readonly _ctrlAEvent = new EventEmitter();
  public readonly ctrlAEvent$ = this._ctrlAEvent.asObservable();

  private readonly _ctrlCEvent = new EventEmitter();
  public readonly ctrlCEvent$ = this._ctrlCEvent.asObservable();

  private readonly _ctrlXEvent = new EventEmitter();
  public readonly ctrlXEvent$ = this._ctrlXEvent.asObservable();

  private readonly _ctrlVEvent = new EventEmitter();
  public readonly ctrlVEvent$ = this._ctrlVEvent.asObservable();

  private readonly _ctrlZEvent = new EventEmitter();
  public readonly ctrlZEvent$ = this._ctrlZEvent.asObservable();

  private readonly _delEvent = new EventEmitter();
  public readonly delEvent$ = this._delEvent.asObservable();

  private readonly _enterEvent = new EventEmitter();
  public readonly enterEvent$ = this._enterEvent.asObservable();

  private readonly _shiftArrowUpEvent = new EventEmitter();
  public readonly shiftArrowUpEvent$ = this._shiftArrowUpEvent.asObservable();

  private readonly _shiftArrowDownEvent = new EventEmitter();
  public readonly shiftArrowDownEvent$ = this._shiftArrowDownEvent.asObservable();

  private readonly _shiftArrowLeftEvent = new EventEmitter();
  public readonly shiftArrowLeftEvent$ = this._shiftArrowLeftEvent.asObservable();

  private readonly _shiftArrowRightEvent = new EventEmitter();
  public readonly shiftArrowRightEvent$ = this._shiftArrowRightEvent.asObservable();

  private readonly _tabEvent = new EventEmitter();
  public readonly tabEvent$ = this._tabEvent.asObservable();

  private _selEventsWereRegistered: boolean = false;

  constructor() { 
    this._consumeWindowEvents();
    // this._windowFocus();
  }

  private async _consumeWindowEvents() {
    await listen('tauri://window-created', () => this._windowFocus());
    await listen('tauri://focus', () => this._windowFocus());
    await listen('tauri://blur', () => this._windowFocusOut());
  }

  public async copyToClipboard(text: string) {
    await writeText(text);
  }

  public async getClipboardText() {
    return (await readText()) || '';
  }

  public async registerSelectionEvents() {
    const events: Indexable<EventEmitter<void>> = {
      'Delete': this._delEvent,
      'Enter': this._enterEvent,
      'Tab': this._tabEvent
    };
    for (const key in events) {
      if (await isRegistered(key)) continue;
      await register(key, () => events[key].emit());
    }
    this._selEventsWereRegistered = true;
  }

  public async unRegisterDelete() {
    await unregister('Delete');
    this._selEventsWereRegistered = false;
  }

  private async _windowFocus() {
    const events: Indexable<EventEmitter<void>> = {
      'ArrowUp': this._arrowUpEvent, 
      'ArrowDown': this._arrowDownEvent, 
      'ArrowLeft': this._arrowLeftEvent, 
      'ArrowRight': this._arrowRightEvent, 
      'CommandOrControl+A': this._ctrlAEvent,
      'CommandOrControl+C': this._ctrlCEvent, 
      'CommandOrControl+X': this._ctrlVEvent, 
      'CommandOrControl+V': this._ctrlVEvent,
      'CommandOrControl+Z': this._ctrlZEvent,
      'Shift+ArrowUp': this._shiftArrowUpEvent,
      'Shift+ArrowDown': this._shiftArrowDownEvent,
      'Shift+ArrowLeft': this._shiftArrowLeftEvent,
      'Shift+ArrowRight': this._shiftArrowRightEvent,
    }
    for (const key in events) {
      if (await isRegistered(key)) continue;
      await register(key, () => events[key].emit());
    }
    if (this._selEventsWereRegistered) this.registerSelectionEvents();
  }

  private async _windowFocusOut() {
    await unregisterAll();
  }
}
