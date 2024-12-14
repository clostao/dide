import { useEffect, useState } from 'react'
import { Table as TTable } from '../../../../common/models/database'
import { Table } from '../../components/Table'
import { QueryResult } from 'pg'
import { isLoaded } from '../../../../common/types/async'
import { toast } from 'react-toast'
import { databasesStore } from '../../../../common/state/databases'

export const ConnectionView = ({ url }: { url: string }): JSX.Element => {
  const [selectedTable, setSelectedTable] = useState<[string, string] | null>(null)
  const [tableData, setTableData] = useState<QueryResult<Record<string, unknown>> | null>(null)

  const databases = databasesStore(({ databases }) => databases)

  useEffect(() => {
    if (!databases) {
      toast.error('Database not found')
    }
  }, [databases])

  useEffect(() => {
    if (selectedTable) {
      window.pg.getTableData(url, selectedTable[0], selectedTable[1]).then((result) => {
        if (result.success) {
          setTableData(result.value)
        } else {
          toast.error(result.error)
        }
      })
    }
  }, [selectedTable])

  return (
    <div className="flex flex-row h-full w-full border border-right border-gray-200">
      <div className="flex flex-col w-1/4 p-4 border-r border-gray-200 resize overflow-auto">
        <h2 className="text-lg font-bold">Database Schema</h2>
        <div className="mt-4">
          {isLoaded(databases.schemas) ? (
            Object.values(databases.schemas.value).map((schema) => (
              <Schema
                key={schema.name}
                schema={schema.name}
                tables={schema.tables}
                onSelectTable={setSelectedTable}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 font-semibold">Loading schema...</div>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4">
        {tableData ? (
          <>
            <h2 className="text-lg font-bold">
              {selectedTable?.[0]}.{selectedTable?.[1]}
            </h2>
            <div className="mt-16 w-full flex-grow overflow-x-scroll">
              <Table data={tableData} />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 font-semibold">No table selected</div>
        )}
      </div>
    </div>
  )
}

const Schema = ({
  schema,
  tables,
  onSelectTable
}: {
  schema: string
  tables: TTable[]
  onSelectTable: (table: [string, string]) => void
}): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <div>
      <h3 onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer hover:text-blue-500">
        {schema}
      </h3>
      {isExpanded && (
        <div>
          {tables.map((table) => (
            <div
              key={table.name}
              className="ml-4 hover:text-blue-500 cursor-pointer"
              onClick={() => onSelectTable([schema, table.name])}
            >
              {table.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
