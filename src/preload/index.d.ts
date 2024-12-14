import { ElectronAPI } from '@electron-toolkit/preload'
import { pgService } from '../backend/services/pg'
import { appService } from '../backend/services/app'
import { state } from '../backend/services/state'
import { Handlers } from 'zutron'

declare global {
  interface Window {
    electron: ElectronAPI
    pg: typeof pgService
    api: {
      log: <T>(message: T) => T
    }
    app: typeof appService
    zutron: Handlers
    state: typeof state
  }
}
