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
  id: 'TXN' | 'time' | 'amount' | 'address' | 'type'
  label: string
  minWidth?: number
  align?: 'left'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'time', label: 'TIME', minWidth: 80 },
  {
    id: 'type',
    label: 'TYPE',
    minWidth: 150,
    align: 'left',
    format: (value: number) => value.toFixed(2),
  },
  {
    id: 'amount',
    label: 'AMOUNT',
    minWidth: 170,
    align: 'left',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'address',
    label: 'ADDRESS',
    minWidth: 150,
    align: 'left',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  { id: 'TXN', label: 'TXN', minWidth: 60, align: 'left' },
]

interface Data {
  name: string
  code: string
  population: number
  size: number
  density: number
}

function createData(name: string, code: string, population: number, size: number): Data {
  const density = population / size
  return { name, code, population, size, density }
}

export default function StickyHeadTable(tableData: any) {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const handleConvertRemainTime = (date:any) => {
    const pastDate = new Date(date).getTime()
    const currentDate = new Date().getTime()
    const timeDifferenceInSeconds = parseInt(((currentDate - pastDate) / 1000).toFixed(0))
    if (timeDifferenceInSeconds < 60) {
      return `${timeDifferenceInSeconds}s ago`
    } else if (timeDifferenceInSeconds >= 60 && timeDifferenceInSeconds < 3600) {
      return `${(timeDifferenceInSeconds / 60).toFixed(0)}m ago`
    } else if (timeDifferenceInSeconds >= 3600 && timeDifferenceInSeconds < 86400) {
      return `${(timeDifferenceInSeconds / 3600).toFixed(0)}h ago`
    } else {
      return `${(timeDifferenceInSeconds / 86400).toFixed(0)}d ago`
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
      <TableContainer
        sx={{
          'height': 400,
          'borderRadius': '5px',
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
        className="rounded-[5px]"
      >
        <Table
          stickyHeader
          aria-label="sticky table"
          sx={{ borderRadius: '5px' }}
          className="rounded-[5px] bg-white text-black"
        >
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#e6e6e6', color: 'black' }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index:any) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell align="left" className="text-nowrap">
                    <div className="text-black">{handleConvertRemainTime(row.createdAt)}</div>
                  </TableCell>
                  <TableCell align="left">
                    {row.type === 'staking' ? (
                      <>
                        <div className="rounded-full bg-green-200 text-center text-green-900">Stake</div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-full bg-red-200 text-center text-red-900">Unstake</div>
                      </>
                    )}
                  </TableCell>
                  <TableCell align="left">
                    <div className="text-black">{parseFloat(row.amount.toFixed(4).toString())}</div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="text-black">
                      <Link href={`https://esc-testnet.elastos.io/address/${row.address}`} target="_blank">
                        {'...' + row.address.substring(36, 43)}
                      </Link>
                    </div>
                  </TableCell>

                  <TableCell align="left">
                    <div className="text-gray-300">
                      <Link
                        href={`https://esc-testnet.elastos.io/tx/${row.transactionHash}/token-transfers`}
                        target="_blank"
                      >
                        <img className="w-[21px]" src="transactionLink.svg" />
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        style={{ color: 'black' }}
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tableData.tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
