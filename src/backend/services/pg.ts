import { Client, QueryResult } from 'pg'
import parse from 'parse-uri'
import { Column, Schema } from '../../common/models/database'
import { err, ok, Result } from '../../common/types/result'

const internalSchemas = [
  'pg_catalog',
  'information_schema',
  'pg_extension',
  'pg_toast',
  'hdb_catalog'
]

type TestConnectionResult =
  | {
      success: false
      error: string
    }
  | {
      success: true
    }

const createClient = (connectionString: string): Client => {
  const uri = parse(connectionString)

  if (!uri.host || !uri.port || !uri.user || !uri.path) {
    throw new Error(
      `Connection string is not complete: ${connectionString} (missing ${
        !uri.host ? 'host' : !uri.port ? 'port' : !uri.user ? 'username' : 'database'
      })`
    )
  }

  return new Client({
    host: uri.host,
    port: Number(uri.port),
    user: uri.user,
    password: uri.password,
    database: uri.path.split('/')[1]
  })
}

const testConnection = async (connectionString: string): Promise<TestConnectionResult> => {
  try {
    const client = createClient(connectionString)

    await client.connect()
    await client.end()
  } catch (error: unknown) {
    return err(error instanceof Error ? error.message : String(error))
  }

  return ok({ success: true })
}

const clientCache: Record<string, Client | null> = {}

const getDatabaseSchemas = async (connectionString: string): Promise<Result<Schema[]>> => {
  try {
    if (!clientCache[connectionString]) {
      clientCache[connectionString] = createClient(connectionString)
      await clientCache[connectionString].connect()
    }

    const client = clientCache[connectionString]
    clientCache[connectionString] = null

    const result = await client.query('SELECT schema_name FROM information_schema.schemata')

    const schemas = result.rows
      .map((row) => row.schema_name)
      .filter((schema) => !internalSchemas.includes(schema))

    const tablesResult = await client.query(
      `
    SELECT 
      table_schema,
      table_name
    FROM information_schema.tables 
    WHERE table_schema = ANY($1)
    ORDER BY table_schema, table_name
  `,
      [schemas]
    )

    const tablesBySchema: Record<string, string[]> = tablesResult.rows.reduce(
      (acc, row) => {
        if (!acc[row.table_schema]) {
          acc[row.table_schema] = []
        }
        acc[row.table_schema].push(row.table_name)
        return acc
      },
      {} as Record<string, string[]>
    )

    const columnsResult = await client.query(
      `
    SELECT 
      table_schema,
      table_name,
      column_name,
      data_type
    FROM information_schema.columns
    WHERE table_schema = ANY($1)
    ORDER BY table_schema, table_name, ordinal_position
  `,
      [schemas]
    )

    const columnsByTable: Record<string, Record<string, Column[]>> = columnsResult.rows.reduce(
      (acc, row) => {
        if (!acc[row.table_schema]) {
          acc[row.table_schema] = {}
        }
        if (!acc[row.table_schema][row.table_name]) {
          acc[row.table_schema][row.table_name] = []
        }
        acc[row.table_schema][row.table_name].push({
          name: row.column_name,
          type: 'string'
        })
        return acc
      },
      {} as Record<string, Record<string, Column[]>>
    )

    console.error('tablesBySchema', tablesBySchema)
    console.error('columnsByTable', columnsByTable)

    const value = Object.entries(tablesBySchema).map(([schemaName, tables]) => ({
      name: schemaName,
      tables: tables.map((tableName) => ({
        name: tableName,
        columns: columnsByTable[schemaName][tableName] || []
      }))
    }))

    return ok(value)
  } catch (error: unknown) {
    return err(error instanceof Error ? error.message : String(error))
  }
}

type TableData = QueryResult<Record<string, unknown>>

const getTableData = async (
  connectionString: string,
  schema: string,
  table: string
): Promise<Result<TableData>> => {
  if (!clientCache[connectionString]) {
    clientCache[connectionString] = createClient(connectionString)
    await clientCache[connectionString].connect()
  }
  const client = clientCache[connectionString]

  const result = await client.query<Record<string, unknown>>(
    `SELECT * FROM ${schema}.${table} limit 100`
  )

  return ok(result)
}

export const pgService = { testConnection, getDatabaseSchemas, getTableData }
