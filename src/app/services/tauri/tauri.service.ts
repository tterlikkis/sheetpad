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

  private readonly _ctrlCEvent = new EventEmitter();
  public readonly ctrlCEvent$ = this._ctrlCEvent.asObservable();

  private readonly _ctrlXEvent = new EventEmitter();
  public readonly ctrlXEvent$ = this._ctrlXEvent.asObservable();

  private readonly _ctrlVEvent = new EventEmitter();
  public readonly ctrlVEvent$ = this._ctrlVEvent.asObservable();

  private readonly _delEvent = new EventEmitter();
  public readonly delEvent$ = this._delEvent.asObservable();

  private readonly _shiftArrowUpEvent = new EventEmitter();
  public readonly shiftArrowUpEvent$ = this._shiftArrowUpEvent.asObservable();

  private readonly _shiftArrowDownEvent = new EventEmitter();
  public readonly shiftArrowDownEvent$ = this._shiftArrowDownEvent.asObservable();

  private readonly _shiftArrowLeftEvent = new EventEmitter();
  public readonly shiftArrowLeftEvent$ = this._shiftArrowLeftEvent.asObservable();

  private readonly _shiftArrowRightEvent = new EventEmitter();
  public readonly shiftArrowRightEvent$ = this._shiftArrowRightEvent.asObservable();

  private _delWasRegistered: boolean = false;

  constructor() { 
    this._consumeWindowEvents();
    this._windowFocus();
  }

  private async _consumeWindowEvents() {
    await listen('tauri://window-created', (event) => this._windowFocus());
    await listen('tauri://focus', (event) => this._windowFocus());
    await listen('tauri://blur', (event) => this._windowFocusOut());
  }

  public async copyToClipboard(text: string) {
    await writeText(text);
  }

  public async getClipboardText() {
    return (await readText()) || '';
  }

  public async registerDelete() {
    const str = 'Delete';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._delEvent.emit());
    this._delWasRegistered = true;
  }

  public async unRegisterDelete() {
    await unregister('Delete');
    this._delWasRegistered = false;
  }

  private async _windowFocus() {
    const events: Indexable<EventEmitter<void>> = {
      'ArrowUp': this._arrowUpEvent, 
      'ArrowDown': this._arrowDownEvent, 
      'ArrowLeft': this._arrowLeftEvent, 
      'ArrowRight': this._arrowRightEvent, 
      'CommandOrControl+C': this._ctrlCEvent, 
      'CommandOrControl+X': this._ctrlVEvent, 
      'CommandOrControl+V': this._ctrlVEvent,
      'Shift+ArrowUp': this._shiftArrowUpEvent,
      'Shift+ArrowDown': this._shiftArrowDownEvent,
      'Shift+ArrowLeft': this._shiftArrowLeftEvent,
      'Shift+ArrowRight': this._shiftArrowRightEvent,
    }

    for (const key in events) {
      const result = await isRegistered(key);
      if (result) continue;
      await register(key, () => {
        events[key].emit()
      });
    }

    if (this._delWasRegistered) this.registerDelete();
  }

  private async _windowFocusOut() {
    await unregisterAll();
  }
}
