import { EventEmitter, Injectable } from '@angular/core';
import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut';
import { listen } from '@tauri-apps/api/event';
import { readText, writeText } from '@tauri-apps/api/clipboard';
import { Indexable } from '../models/indexable.interface';

@Injectable({
  providedIn: 'root'
})
export class TauriService {

  private readonly _arrowUpEvent: EventEmitter<void> = new EventEmitter();
  public readonly arrowUpEvent$ = this._arrowUpEvent.asObservable();

  private readonly _arrowDownEvent: EventEmitter<void> = new EventEmitter();
  public readonly arrowDownEvent$ = this._arrowDownEvent.asObservable();

  private readonly _arrowLeftEvent: EventEmitter<void> = new EventEmitter();
  public readonly arrowLeftEvent$ = this._arrowLeftEvent.asObservable();

  private readonly _arrowRightEvent: EventEmitter<void> = new EventEmitter();
  public readonly arrowRightEvent$ = this._arrowRightEvent.asObservable();

  private readonly _ctrlCEvent: EventEmitter<void> = new EventEmitter();
  public readonly ctrlCEvent$ = this._ctrlCEvent.asObservable();

  private readonly _ctrlXEvent: EventEmitter<void> = new EventEmitter();
  public readonly ctrlXEvent$ = this._ctrlXEvent.asObservable();

  private readonly _ctrlVEvent: EventEmitter<void> = new EventEmitter();
  public readonly ctrlVEvent$ = this._ctrlVEvent.asObservable();

  private readonly _delEvent: EventEmitter<void> = new EventEmitter();
  public readonly delEvent$ = this._delEvent.asObservable();

  constructor() { 
    this._consumeWindowEvents();
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
    console.log('Registering delete');
    await register(str, () => this._delEvent.emit());
  }

  public async unRegisterDelete() {
    await unregister('Delete');
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
    }

    for (const key in events) {
      const result = await isRegistered(key);
      if (result) continue;
      await register(key, () => events[key].emit());
    }
  }

  private async _windowFocusOut() {
    console.log('Unregistering');
    await unregisterAll();
  }
}
