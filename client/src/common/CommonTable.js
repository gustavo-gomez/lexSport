import React from 'react'
import '../scss/components/commontable.scss'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import map from 'lodash/map'
import { useSelector } from 'react-redux'
import { auth } from '../slices/authSlice'
import { ROLES } from '../utils/utils'

const CommonTable = ({ tableHeader, body, onClickRow }) => {

	const { loggedUser } = useSelector(auth)
	const isAdmin = loggedUser?.role === ROLES.ADMIN

	return (
		<TableContainer component={Paper} >
			<Table aria-label="simple table">
				<TableHead className={'table-header'}>
					<TableRow>
						{
							map(tableHeader, (item, index) => {
								if (item.onlyAdmin && !isAdmin) return null
								return (
									<TableCell
										key={`header-${item.key}`}
										// sx={index === 0 ? { width: 5 } : {}}
									>
										{item.label}
									</TableCell>
								)
							})
						}
					</TableRow>
				</TableHead>
				<TableBody>
					{map(body, (row, index) => (
						<TableRow
							key={`${row.id}-${index}`}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							// onClick={() => onClickRow(index)}
							className="table-row-body"
						>
							{
								map(tableHeader, header => {
									if (header.onlyAdmin && !isAdmin) return null
									return (

										<TableCell
											key={`row-${row.id}-${header.key}`}
											style={header.label === '' ? { width: 60 } : { maxWidth: 80 }}
											// align={header?.align}
										>
											{row[header.key]}
										</TableCell>
									)
								})
							}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}

export default CommonTable
