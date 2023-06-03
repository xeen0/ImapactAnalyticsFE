import React, { useMemo, useState } from 'react';

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import {
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

const Cell = ({ getValue, row: { index }, column: { id }, table }) => {
  const initialValue = getValue()
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)
  const [editing, setEditing] = useState(false)

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    setEditing(false)
    table.options.meta?.updateData(index, id, value)
    
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])
  
  return (
    <>
    {editing ? <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={onBlur}
    />: <span onClick={() => setEditing(true)}>{value}</span>}
    </>
  )
}

const columns = [
  {
    accessorKey: 'id',
    header:() => 'Id',
    cell: ({ getValue }) => <span>{getValue() + 1}</span>
  },
  {
    accessorKey: 'name',
    header: () => 'Name',
    editable: false,
    sortable: true
  },
  {
    accessorKey: 'category',
    header: () => 'Category',
    editable: false,
    sortable: false
  },
  {
    accessorKey: 'price',
    header: () => 'Price',
    editable: true,
    sortable: true,
    cell: Cell
  },
  {
    accessorKey: 'label',
    header: () => 'Label',
    editable: false,
    sortable: false
  },
  
];

export default function SReactTable({ tableData = [] }) {
const [sorting, setSorting] = useState([])
const initialState = useMemo(() => tableData)
const [data ,setData] = useState(() => tableData)
  const table = useReactTable({
    data,
    columns,
    initialState,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              }
            }
            return row
          })
        )
      },
    },
  });
  let resetTableData = async () => {
    await table.setState(table.initialState)
    await setData(tableData)
  }
  let saveTableData = async () => {
    await sessionStorage.setItem("tableData", JSON.stringify(data));
    alert("Table data saved");
  }
  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='table-header-group'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableCell key={header.id} colSpan={header.colSpan} className='table-row' style={{backgroundColor:"#e4e4e4"}}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: "🔼",
                            desc: "🔽",
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className='table-row-group'>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }} className='table-cell'>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    <div style={{display:'flex',gap: 10, justifyContent:'center', marginTop: '10px'}}>
      <Button variant="contained" onClick={saveTableData} style={{marginRight: '40px'}}>Save</Button>
      <Button variant="outlined" onClick={resetTableData}>Reset</Button>
    </div>
    </Box>
  );
}
