import React from 'react'
import IATimeDatePicker from './IATimeDatePicker'
import '../scss/components/iafilters.scss'
import Button from '@mui/material/Button'

const IAFilters = ({ startDate, setStartDate, endDate, setEndDate, onSearch, isLoading }) => {

	return (
		<div
			className={'filters-container card'}
		>
			<div
				className={'filters-wrapper'}
			>
				<div
					className={'filter-item'}
				>
					<label>Fecha Inicio</label>
					<IATimeDatePicker
						value={startDate}
						handleChange={(value) => {
							setStartDate(new Date(value))
						}}
					/>
				</div>
				<div
					className={'filter-item'}
				>
					<label>Fecha Final</label>
					<IATimeDatePicker
						value={endDate}
						handleChange={(value) => {
							setEndDate(new Date(value))
						}}
					/>
				</div>
			</div>
			<>
				<Button
					onClick={onSearch}
					variant="outlined"
					disabled={isLoading}
				>
					Buscar
				</Button>
			</>
		</div>
	)
}

export default IAFilters
