import { contextBridge, ipcRenderer,IpcRendererEvent }  from 'electron';

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


contextBridge.exposeInMainWorld(
  'api',
  {
    openFiles: () => ipcRenderer.send('openFiles'),
    getFiles: (callback :(event: IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('getFiles',callback)
  }
)
