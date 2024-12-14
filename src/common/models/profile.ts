import { DatabaseConnectionInfo } from './database'

export interface Profile {
  id: string
  name: string
  databases: DatabaseConnectionInfo[]
  createdAt: number
  updatedAt: number
}
