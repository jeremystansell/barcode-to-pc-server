import { Injectable } from '@angular/core';
import { ipcRenderer, remote, shell } from 'electron';
import { StorageProvider } from '../storage/storage';
import ElectronStore from 'electron-store'

declare var window: any;
// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.


/*
 https://electronjs.org/docs/api/remote
*/
@Injectable()
export class ElectronProvider {

  ipcRenderer: typeof ipcRenderer;
  dialog: typeof remote.dialog;
  app: typeof remote.app;
  shell: typeof shell;
  process: typeof process;
  remote: typeof remote;
  ElectronStore: typeof ElectronStore;

  constructor(
    private storageProvider: StorageProvider
  ) {
    // console.log('test')
    if (this.isElectron()) {
      let electron = window.require('electron');

      this.ipcRenderer = electron.ipcRenderer;
      this.dialog = electron.remote.dialog;
      this.app = electron.remote.app;
      this.shell = electron.shell;
      this.process = electron.remote.process;
      this.remote = electron.remote;
      this.ElectronStore = electron.remote.require('electron-store');
    }
  }

  sendReadyToMainProcess() {
    if (this.isElectron()) {
      this.ipcRenderer.send('pageLoad'); // send the first message from the renderer
      this.ipcRenderer.send('settings', this.storageProvider.getSettings());
    }
  }

  isElectron() {
    // console.log(process)
    return window.require; // && process.type;
  }

  isDev() {
    return !this.isElectron() || (this.process && this.process.argv.indexOf('--dev') != -1);
  }

}
