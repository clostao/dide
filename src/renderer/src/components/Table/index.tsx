import type { QueryResult } from 'pg'

export const Table = ({ data }: { data: QueryResult<Record<string, unknown>> }): JSX.Element => {
  const columns = data.fields.map((field) => field.name)
  const values = data.rows.map((row) =>
    Object.fromEntries(columns.map((column) => [column, row[column]]))
  )

  return (
    <table className="min-w-full overflow-x-scroll">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} className="text-center font-bold px-4 overflow-auto resize-x">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((value, index) => (
          <tr key={index} className="border-b border-gray-200 p-16 first:pt-0 last:border-b-0">
            {Object.entries(value).map(([key, value]) => (
              <td
                key={key}
                className="text-center overflow-hidden text-ellipsis whitespace-nowrap min-w-0"
              >
                {parseValue(value)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export const parseValue = (value: unknown): string => {
  if (value === undefined) {
    return '<undefined>'
  }

  if (value === null) {
    return '<null>'
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
