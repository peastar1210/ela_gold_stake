import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'

interface Column {
  id: 'NO' | 'TIME TILL COMPLETION' | '% OF COMPLETION' | 'REWARDS' | 'TOTAL' | 'DOLLAR VALUE' | 'UNSTAKE'
  label: string
  minWidth?: number
  align?: 'left'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'NO', label: 'NO', minWidth: 60 },
  { id: 'TIME TILL COMPLETION', label: 'COMPLETION', minWidth: 100 },
  {
    id: 'REWARDS',
    label: 'REWARDS',
    minWidth: 100,
    align: 'left',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'TOTAL',
    label: 'TOTAL',
    minWidth: 100,
    align: 'left',
    format: (value: number) => value.toFixed(2),
  },
  {
    id: 'DOLLAR VALUE',
    label: 'DOLLAR VALUE',
    minWidth: 100,
    align: 'left',
    format: (value: number) => value.toFixed(2),
  },
  {
    id: 'UNSTAKE',
    label: '',
    minWidth: 100,
    align: 'left',
    format: (value: number) => value.toFixed(2),
  },
]

export default function StickyHeadTable(props: any) {
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
              'height': 630,
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
            className="text-black"
          >
            <Table stickyHeader aria-label="sticky table" className="bg-white text-black">
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
                {props.stakingListStatus === 'active' ? (
                  <>
                    {props.userStakedList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                            // style={{ border: '1px', borderColor: '#bfbfbf' }}
                          >
                            <TableCell align="left">
                              <div className="text-black">{index + 1}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{handleCompletionTime(row)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">
                                {(
                                  (row.amount * row.multiply * props.totalBalance) / (100 * props.totalStakedAmount) -
                                  row.amount
                                ).toFixed(4)}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">
                                {(
                                  (row.amount * row.multiply * props.totalBalance) /
                                  (100 * props.totalStakedAmount)
                                ).toFixed(4)}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">
                                {(
                                  ((row.amount * row.multiply * props.totalBalance) / (100 * props.totalStakedAmount)) *
                                  parseFloat(props.usdPrice)
                                ).toFixed(4)}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              {row.unlockTimeToSec < 0 ? (
                                <>
                                  <button
                                    className="flex items-center justify-center rounded-full bg-red-200 px-2 py-1 text-red-900"
                                    onClick={() => {
                                      props.handleUnstake(row.uuid, row.amount)
                                    }}
                                  >
                                    Unstake
                                  </button>
                                </>
                              ) : (
                                <>
                                  <>
                                    <button
                                      className="flex items-center justify-center rounded-full bg-gray-200 px-2 py-1 text-gray-900"
                                      onClick={() => {
                                        props.handleUnstake(row.uuid, row.amount)
                                      }}
                                      disabled
                                    >
                                      Unstake
                                    </button>
                                  </>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </>
                ) : (
                  <>
                    {props.userUnstakeList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                            <TableCell align="left">
                              <div className="text-black">{index + 1}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">finished</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{(row.amount - row.previousAmount).toFixed(4)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{row.amount.toFixed(4)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{(row.amount * parseFloat(props.usdPrice)).toFixed(4)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="flex items-center justify-center rounded-full bg-blue-200 px-2 py-1 text-blue-900">
                                Unstaked
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <TableContainer
            sx={{
              'maxheight': 630,
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
            className="text-black"
          >
            <Table stickyHeader aria-label="sticky table" className="text-black">
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
                {props.stakingListStatus === 'active' ? (
                  <>
                    {props.userStakedList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                            <TableCell align="left">
                              <div className="text-black">{index + 1}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{handleCompletionTime(row)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">
                                {(
                                  (row.amount * row.multiply * props.totalBalance) / (100 * props.totalStakedAmount) -
                                  row.amount
                                ).toFixed(4)}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">
                                {(
                                  (row.amount * row.multiply * props.totalBalance) /
                                  (100 * props.totalStakedAmount)
                                ).toFixed(4)}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">
                                {(
                                  ((row.amount * row.multiply * props.totalBalance) / (100 * props.totalStakedAmount)) *
                                  parseFloat(props.usdPrice)
                                ).toFixed(4)}
                              </div>
                            </TableCell>
                            <TableCell align="left">
                              {row.unlockTimeToSec < 0 ? (
                                <>
                                  <button
                                    className="flex items-center justify-center rounded-full bg-red-200 px-2 py-1 text-red-900"
                                    onClick={() => {
                                      props.handleUnstake(row.uuid, row.amount)
                                    }}
                                  >
                                    Unstake
                                  </button>
                                </>
                              ) : (
                                <>
                                  <>
                                    <button
                                      className="flex items-center justify-center rounded-full bg-gray-200 px-2 py-1 text-gray-900"
                                      onClick={() => {
                                        props.handleUnstake(row.uuid, row.amount)
                                      }}
                                      disabled
                                    >
                                      Unstake
                                    </button>
                                  </>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </>
                ) : (
                  <>
                    {props.userUnstakeList
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                            <TableCell align="left">
                              <div className="text-black">{index + 1}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">finished</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{(row.amount - row.previousAmount).toFixed(4)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{row.amount.toFixed(4)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="text-black">{(row.amount * parseFloat(props.usdPrice)).toFixed(4)}</div>
                            </TableCell>
                            <TableCell align="left">
                              <div className="flex items-center justify-center rounded-full bg-blue-200 px-2 py-1 text-blue-900">
                                Unstaked
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {props.stakingListStatus === 'active' ? (
        <>
          <TablePagination
            style={{ color: 'black' }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={props.userStakedList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      ) : (
        <>
          <TablePagination
            style={{ color: 'black' }}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={props.userUnstakeList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  )
}
