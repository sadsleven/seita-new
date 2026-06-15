import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  /** Custom cell renderer; receives the row. */
  render?: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  /** Field used as React key. @default 'id' */
  rowKey?: keyof T | string;
  emptyText?: string;
  onRowClick?: (row: T) => void;
}

/** Data table with bold centered headers, hover rows and custom cells. */
export function DataTable<T extends object>({
  columns,
  rows,
  rowKey = 'id',
  emptyText = 'No hay registros para mostrar.',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                align="center"
                sx={{
                  fontWeight: 800,
                  fontSize: '0.9375rem',
                  color: 'text.primary',
                  bgcolor: 'var(--surface-sunken)',
                  borderBottom: '2px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ border: 0 }}>
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography color="text.secondary">{emptyText}</Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow
                key={String((row as Record<string, unknown>)[rowKey as string] ?? i)}
                hover
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align ?? 'left'} sx={{ fontSize: '0.9375rem' }}>
                    {col.render ? col.render(row) : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
