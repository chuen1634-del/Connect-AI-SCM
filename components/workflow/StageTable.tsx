type Column = { key: string; label: string; format?: (value: unknown, row: Record<string, unknown>) => React.ReactNode };
export function StageTable({ rows, columns }: { rows: Record<string, unknown>[]; columns: Column[] }) {
  return <div className="table-wrap"><table><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? index)}>{columns.map((column) => <td key={column.key}>{column.format ? column.format(row[column.key], row) : String(row[column.key] ?? "-")}</td>)}</tr>)}</tbody></table></div>;
}
