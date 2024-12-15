import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pgService } from '../backend/services/pg'
import { services } from '../backend/services/pull'
import { state } from '../backend/services/state'
import { profiles } from '../backend/services/pull/profiles'
import {
  createNamespacedIpcHandlers,
  createNamespaceWindowObject,
  registerRendererIPCHandler
} from '../common/utils/ipcHandler'

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
    contextBridge.exposeInMainWorld('app', services)
    contextBridge.exposeInMainWorld('state', state)

    const handlers = createNamespacedIpcHandlers('profiles', profiles)
    contextBridge.exposeInMainWorld('profiles', createNamespaceWindowObject(handlers))
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
