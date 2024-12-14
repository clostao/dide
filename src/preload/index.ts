import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pgService } from '../backend/services/pg'
import { appService } from '../backend/services/app'
import { state } from '../backend/services/state'
// Custom APIs for renderer
const api = {
  log: <T>(message: T): T => message
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('pg', pgService)
    contextBridge.exposeInMainWorld('app', appService)
    contextBridge.exposeInMainWorld('state', state)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
