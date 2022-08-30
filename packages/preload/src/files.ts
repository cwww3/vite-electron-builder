import {contextBridge, ipcRenderer, IpcRendererEvent} from 'electron';

// export function test() {
//   console.log(contextBridge)
//   console.log(ipcRenderer)
// }

// contextBridge.exposeInMainWorld(
//   'api',
//   {
//     openFiles: () => ipcRenderer.send('openFiles')
//   }
// )

contextBridge.exposeInMainWorld('api', {
  getTreeFiles: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on('getTreeFiles', callback);
  },
  getFileDetail: async (
    path: string,
    callback: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.on('getFileDetail', callback);
    ipcRenderer.send('onGetFileDetail', path);
  },
});
