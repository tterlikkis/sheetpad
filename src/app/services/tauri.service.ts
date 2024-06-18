import { EventEmitter, Injectable } from '@angular/core';
import { isRegistered, register, unregisterAll } from '@tauri-apps/api/globalShortcut';
import { listen } from '@tauri-apps/api/event';
import { readText, writeText } from '@tauri-apps/api/clipboard';

@Injectable({
  providedIn: 'root'
})
export class TauriService {

  private readonly _ctrlCEvent: EventEmitter<void> = new EventEmitter();
  public readonly ctrlCEvent$ = this._ctrlCEvent.asObservable();

  private readonly _ctrlXEvent: EventEmitter<void> = new EventEmitter();
  public readonly ctrlXEvent$ = this._ctrlXEvent.asObservable();

  private readonly _ctrlVEvent: EventEmitter<void> = new EventEmitter();
  public readonly ctrlVEvent$ = this._ctrlVEvent.asObservable();

  constructor() { 
    this._consumeWindowEvents();
  }

  private async _consumeWindowEvents() {
    await listen('tauri://focus', (event) => this._windowFocus());
    await listen('tauri://blur', (event) => this._windowFocusOut());
  }

  public async copyToClipboard(text: string) {
    await writeText(text);
  }

  public async getClipboardText() {
    return (await readText()) || '';
  }

  private async _registerCopy() {
    const str = 'CommandOrControl+C';
    const result = await isRegistered(str);
    if (result) {
      console.log('Already registered to copy, quitting');
      return;
    }
    console.log('Registering copy');
    await register(str, () => this._ctrlCEvent.emit());
  }

  private async _registerCut() {
    const str = 'CommandOrControl+X';
    const result = await isRegistered(str);
    if (result) {
      console.log('Already registered to cut, quitting');
      return;
    }
    console.log('Registering cut');
    await register(str, () => this._ctrlXEvent.emit());
  }

  private async _registerPaste() {
    const str = 'CommandOrControl+V';
    const result = await isRegistered(str);
    if (result) {
      console.log('Already registered to paste, quitting');
      return;
    }
    console.log('Registering paste');
    await register(str, () => this._ctrlVEvent.emit());
  }

  private _windowFocus() {
    this._registerCopy();
    this._registerCut();
    this._registerPaste();
  }

  private async _windowFocusOut() {
    console.log('Unregistering');
    await unregisterAll();
  }
}
