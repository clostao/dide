import { AsyncValue } from '../types/async'

export enum ConnectionStatus {
  Connected = 'Connected',
  Connecting = 'Connecting',
  Disconnecting = 'Disconnecting',
  Disconnected = 'Disconnected'
}

export interface Database {
  name: string
  url: string
  connectionStatus: ConnectionStatus
  schemas: AsyncValue<Schema[]>
  scripts: AsyncValue<Script[]>
  temporaryScripts: AsyncValue<TemporaryScript[]>
  connectionError?: string
}

export interface Schema {
  name: string
  tables: Table[]
}

export interface Table {
  name: string
  columns: Column[]
}

export type ColumnType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'timestamp'
  | 'json'
  | 'array'
  | 'object'
  | 'null'
  | 'undefined'
  | 'unknown'

export interface Column {
  name: string
  type: ColumnType
}

export interface Script {
  id: string
  name: string
  content: string
}

export interface TemporaryScript {
  id: string
  content: string
}

export interface DatabaseConnectionInfo {
  name: string
  url: string
}
