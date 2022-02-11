import React from 'react'
import '../scss/components/commontable.scss'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import map from "lodash/map";

const CommonTable = ({tableHeader, body, onClickRow}) => {

	return (
		<TableContainer component={Paper}>
			<Table aria-label="simple table">
				<TableHead className={'table-header'}>
					<TableRow>
						{
							map(tableHeader, item => {
								return (
									<TableCell key={`header-${item.key}`}>{item.label}</TableCell>
								)
							})
						}
					</TableRow>
				</TableHead>
				<TableBody>
					{map(body, (row, index) => (
						<TableRow
							key={`${row.name}`}
							sx={{'&:last-child td, &:last-child th': {border: 0}}}
							// onClick={() => onClickRow(index)}
							className='table-row-body'
						>
							{
								map(tableHeader, header => (
									<TableCell
										key={`row-${row.id}-${header.key}`}
										style={header.label === '' ? {width: 105} : null}
									>
										{row[header.key]}
									</TableCell>
								))
							}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default CommonTable
