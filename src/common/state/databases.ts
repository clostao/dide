import { create } from 'zustand'
import { ConnectionStatus, Database } from '../models/database'
import { initAsyncValue } from '../types/async'

export interface ConnectionState extends Record<string, unknown> {
  databases: Database[]
}

export interface ConnectionsStore extends ConnectionState {
  databases: Database[]
  addDatabase: (database: Pick<Database, 'name' | 'url'>) => void
  getDatabase: (url: string) => Database | undefined
  updateDatabase: (url: string, database: Partial<Database>) => void
}

export const databasesStore = create<ConnectionsStore>()((set) => ({
  databases: [],
  addDatabase: (database: Pick<Database, 'name' | 'url'>): void =>
    set((state) => ({
      databases: [
        ...state.databases,
        {
          ...database,
          schemas: initAsyncValue(),
          scripts: initAsyncValue(),
          temporaryScripts: initAsyncValue(),
          connectionStatus: ConnectionStatus.Disconnected
        }
      ]
    })),
  getDatabase: (url: string): Database | undefined =>
    databasesStore.getState().databases.find((database) => database.url === url),
  updateDatabase: (url: string, database: Partial<Database>): void =>
    set((state) => ({
      databases: state.databases.map((db) => (db.url === url ? { ...db, ...database } : db))
    }))
}))
