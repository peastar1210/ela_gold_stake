import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Link from 'next/link'

interface Column {
  id: 'NO' | 'amount' | 'address'
  label: string
  minWidth?: number
  align?: 'left'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'NO', label: 'NO', minWidth: 60 },
  { id: 'amount', label: 'AMOUNT', minWidth: 100 },
  { id: 'address', label: 'ADDRESS', minWidth: 100 },
]

export default function StakerList(props: any) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const handleCompletionTime = item => {
    if (item.multiply === 105) {
      return `${180 - item.unlockTimeToSec}/180`
    } else if (item.multiply === 115) {
      return `${360 - item.unlockTimeToSec}/360`
    } else if (item.multiply === 145) {
      return `${720 - item.unlockTimeToSec}/720`
    } else if (item.multiply === 100) {
      return `${0 - item.unlockTimeToSec}/0`
    } else {
      return `${1440 - item.unlockTimeToSec}/1440`
    }
  }

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 2,
      }}
    >
      {props.windowWidth > 1280 ? (
        <>
          <TableContainer
            sx={{
              'height': 420,
              '&::-webkit-scrollbar': {
                height: '3px',
                border: 'none',
                width: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray',
                // borderRadius: '1px',
                border: 'none',
                width: '2px !important',
              },
              '&::-webkit-scrollbar-track': {
                // borderRadius: '2px',
                border: 'none',
              },
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align={column.align}
                      style={{ minWidth: column.minWidth, backgroundColor: '#e6e6e6', color: 'black' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.stakersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell align="left">
                        <div className="text-black">{index + 1}</div>
                      </TableCell>
                      <TableCell align="left">
                        <div className="text-black">{parseFloat(row.amount.toFixed(4))}</div>
                      </TableCell>
                      <TableCell>
                        <Link href={`https://esc.elastos.io/address/${row.address}`} target="_blank">
                          <div className="text-black">{'...' + row.address.substring(36, 43)}</div>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <TableContainer
            sx={{
              'maxheight': 468,
              '&::-webkit-scrollbar': {
                height: '3px',
                border: 'none',
                width: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray',
                // borderRadius: '1px',
                border: 'none',
                width: '2px !important',
              },
              '&::-webkit-scrollbar-track': {
                // borderRadius: '2px',
                border: 'none',
              },
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
                      align={column.align}
                      style={{ minWidth: column.minWidth, backgroundColor: '#e6e6e6', color: 'black' }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props.stakersList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell align="left">
                        <div className="text-black">{index + 1}</div>
                      </TableCell>
                      <TableCell align="left">
                        <div className="text-black">{parseFloat(row.amount.toFixed(4))}</div>
                      </TableCell>
                      <TableCell>
                        <Link href={`https://esc.elastos.io/address/${row.address}`} target="_blank">
                          <div className="text-black">{'...' + row.address.substring(36, 43)}</div>
                        </Link>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <TablePagination
        style={{ color: 'black' }}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.stakersList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
