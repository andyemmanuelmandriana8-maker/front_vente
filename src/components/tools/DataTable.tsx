import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: string
  accessor?: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedRows?: T[]
  onSelectionChange?: (selectedRows: T[]) => void
  getRowId?: (row: T) => string | number
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  emptyMessage = "Aucune donnée disponible",
  className,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  getRowId,
}: DataTableProps<T>) {
  const getRowIdValue = (row: T, index: number): string | number => {
    if (getRowId) {
      return getRowId(row)
    }
    return row.id ?? index
  }

  const isRowSelected = (row: T, index: number): boolean => {
    if (!selectable || selectedRows.length === 0) return false
    const rowId = getRowIdValue(row, index)
    return selectedRows.some(
      (selectedRow) => getRowIdValue(selectedRow, 0) === rowId
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    if (checked) {
      onSelectionChange([...data])
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectRow = (row: T, index: number, checked: boolean) => {
    if (!onSelectionChange) return
    const rowId = getRowIdValue(row, index)
    if (checked) {
      onSelectionChange([...selectedRows, row])
    } else {
      onSelectionChange(
        selectedRows.filter(
          (selectedRow) => getRowIdValue(selectedRow, 0) !== rowId
        )
      )
    }
  }

  const allSelected =
    selectable && data.length > 0 && selectedRows.length === data.length

  const getCellValue = (row: T, column: Column<T>) => {
    if (column.accessor) {
      return column.accessor(row)
    }
    return row[column.key] ?? ""
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Sélectionner tout"
                />
              </TableHead>
            )}
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => {
              const isSelected = isRowSelected(row, rowIndex)
              return (
                <TableRow
                  key={getRowIdValue(row, rowIndex)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    isSelected && "bg-muted/50"
                  )}
                >
                  {selectable && (
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="w-12"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleSelectRow(row, rowIndex, checked as boolean)
                        }
                        aria-label={`Sélectionner la ligne ${rowIndex + 1}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {getCellValue(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

