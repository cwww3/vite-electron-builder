import {
  app,
  dialog,
  ipcMain,
  BrowserWindow,
  Menu,
  MenuItemConstructorOptions,
  ipcRenderer,
} from 'electron';
import './security-restrictions';
import {restoreOrCreateWindow} from '/@/mainWindow';
import {getTreeFiles, newEmptyTree} from './utils/files';
import * as fs from 'fs';

/**
 * Prevent electron from running multiple instances.
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration to save more system resources.
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/latest/api/app#event-activate-macos Event: 'activate'.
 */
app.on('activate', restoreOrCreateWindow);

/**
 * Create the application window when the background process is ready.
 */

app
  .whenReady()
  .then(restoreOrCreateWindow)
  .then(() => {})
  .catch(e => console.error('Failed create window:', e));

/**
 * Install Vue.js or any other extension in development mode only.
 * Note: You must install `electron-devtools-installer` manually
 */
// if (import.meta.env.DEV) {
//   app.whenReady()
//     .then(() => import('electron-devtools-installer'))
//     .then(({default: installExtension, VUEJS3_DEVTOOLS}) => installExtension(VUEJS3_DEVTOOLS, {
//       loadExtensionOptions: {
//         allowFileAccess: true,
//       },
//     }))
//     .catch(e => console.error('Failed install extension:', e));
// }

/**
 * Check for new version of the application - production mode only.
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import('electron-updater'))
    .then(({autoUpdater}) => autoUpdater.checkForUpdatesAndNotify())
    .catch(e => console.error('Failed check updates:', e));
}

const isMac = process.platform === 'darwin';

const template: MenuItemConstructorOptions[] = [
  // { role: 'appMenu' }
  {
    label: app.name,
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services'},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideOthers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'},
    ],
  },
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [
      isMac ? {role: 'close'} : {role: 'quit'},
      {type: 'separator'},
      {
        label: 'open directory',
        click: () => {
          const directory: string[] | undefined = dialog.showOpenDialogSync({
            properties: ['openDirectory'],
          });
          if (directory && directory.length > 0) {
            let root = getTreeFiles(newEmptyTree(), directory[0]);
            let window = BrowserWindow.getFocusedWindow();
            window?.webContents.send('getTreeFiles', root);
          }
        },
      },
      // {label: 'open file',click:()=>{}},
    ],
  },
  // { role: 'editMenu' }
  // {
  //   label: 'Edit',
  //   submenu: [
  //     {role: 'undo'},
  //     {role: 'redo'},
  //     {type: 'separator'},
  //     {role: 'cut'},
  //     {role: 'copy'},
  //     {role: 'paste'},
  //     ...(isMac
  //       ? [
  //           {role: 'pasteAndMatchStyle'},
  //           {role: 'delete'},
  //           {role: 'selectAll'},
  //           {type: 'separator'},
  //           {
  //             label: 'Speech',
  //             submenu: [{role: 'startSpeaking'}, {role: 'stopSpeaking'}],
  //           },
  //         ]
  //       : [{role: 'delete'}, {type: 'separator'}, {role: 'selectAll'}]),
  //   ],
  // },
  // // { role: 'viewMenu' }
  // {
  //   label: 'View',
  //   submenu: [
  //     {role: 'reload'},
  //     {role: 'forceReload'},
  //     {role: 'toggleDevTools'},
  //     {type: 'separator'},
  //     {role: 'resetZoom'},
  //     {role: 'zoomIn'},
  //     {role: 'zoomOut'},
  //     {type: 'separator'},
  //     {role: 'togglefullscreen'},
  //   ],
  // },
  // // { role: 'windowMenu' }
  // {
  //   label: 'Window',
  //   submenu: [
  //     {role: 'minimize'},
  //     {role: 'zoom'},
  //     ...(isMac
  //       ? [{type: 'separator'}, {role: 'front'}, {type: 'separator'}, {role: 'window'}]
  //       : [{role: 'close'}]),
  //   ],
  // },
  // {
  //   role: 'help',
  //   submenu: [
  //     {
  //       label: 'Learn More',
  //       click: async () => {
  //         const {shell} = require('electron');
  //         await shell.openExternal('https://electronjs.org');
  //       },
  //     },
  //   ],
  // },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

ipcMain.on('onGetFileDetail', (e, path) => {
  let content = fs.readFileSync(path, 'utf-8');
  BrowserWindow.getFocusedWindow()?.webContents.send('getFileDetail', content);
});
