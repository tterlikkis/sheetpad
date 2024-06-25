import { EventEmitter, Injectable } from '@angular/core';
import { isRegistered, register, unregister, unregisterAll } from '@tauri-apps/api/globalShortcut';
import { listen } from '@tauri-apps/api/event';
import { readText, writeText } from '@tauri-apps/api/clipboard';

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

  private async _registerArrowUp(){
    const str = 'ArrowUp';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._arrowUpEvent.emit());
  }

  private async _registerArrowDown(){
    const str = 'ArrowDown';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._arrowDownEvent.emit());
  }

  private async _registerArrowLeft(){
    const str = 'ArrowLeft';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._arrowLeftEvent.emit());
  }

  private async _registerArrowRight(){
    const str = 'ArrowRight';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._arrowRightEvent.emit());
  }


  private async _registerCopy() {
    const str = 'CommandOrControl+C';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._ctrlCEvent.emit());
  }

  private async _registerCut() {
    const str = 'CommandOrControl+X';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._ctrlXEvent.emit());
  }

  public async registerDelete() {
    const str = 'Delete';
    const result = await isRegistered(str);
    if (result) return;
    console.log('Registering delete');
    await register(str, () => this._delEvent.emit());
  }

  private async _registerPaste() {
    const str = 'CommandOrControl+V';
    const result = await isRegistered(str);
    if (result) return;
    await register(str, () => this._ctrlVEvent.emit());
  }

  public async unRegisterDelete() {
    await unregister('Delete');
  }

  private _windowFocus() {
    this._registerArrowUp();
    this._registerArrowDown();
    this._registerArrowLeft();
    this._registerArrowRight();
    this._registerCopy();
    this._registerCut();
    this._registerPaste();
  }

  private async _windowFocusOut() {
    console.log('Unregistering');
    await unregisterAll();
  }
}
