import { ElectronAPI } from '@electron-toolkit/preload'
import { pgService } from '../backend/services/pg'
import { services } from '../backend/services/pull'
import { state } from '../backend/services/state'
import { ipcPushServices } from '../backend/services/push'
import { Handlers } from 'zutron'

type RecordPromisified<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: infer I) => infer O ? (...args: I) => Promisified<O> : T[K]
}

declare global {
  interface Window {
    electron: ElectronAPI
    pg: typeof pgService
    api: {
      log: <T>(message: T) => T
    }
    zutron: Handlers
    state: typeof state
    profiles: RecordPromisified<typeof services.profiles>
    pushServices: (typeof ipcPushServices)['renderer']
  }
}
