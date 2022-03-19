import React, { useEffect, useState } from 'react'
import IATimeDatePicker from './IATimeDatePicker'
import '../scss/components/iafilters.scss'
import Button from '@mui/material/Button'
import IASelect from './IASelect'
import isEmpty from 'lodash/isEmpty'
import { useDispatch, useSelector } from 'react-redux'
import { getWorkers, workers } from '../slices/workersSlice'

const IAFilters = ({ onSearch, isLoading, showWorkerFilter, defaultStartDate, onExport}) => {

	const { workerList } = useSelector(workers)
	const [isError, setIsError] = useState(false)
	const [startDate, setStartDate] = useState(defaultStartDate || new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [selectedWorker, setSelectedWorker] = useState(null)

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getWorkers())
	}, [])

	const search = () => {
		if (showWorkerFilter && isEmpty(selectedWorker)) {
			setIsError(true)
		} else {
			onSearch({ startDate, endDate, workerId: selectedWorker?.id })
		}
	}

	return (
		<div
			className={'filters-container card'}
		>
			<div
				className={'filters-wrapper'}
			>
				{
					showWorkerFilter &&
					<div
						className={'filter-item'}
					>
						<IASelect
							label={'Costurera'}
							key={`worker-filter`}
							value={workerList?.find(worker => worker.id === selectedWorker?.id)}
							data={workerList}
							textToShow={(object) => {
								return `${object?.firstName}, ${object?.lastName}`
							}}
							onChange={(object) => {
								setIsError(false)
								setSelectedWorker(object)
							}}
							isRequired
							error={isError}
							// helperText={isError ? 'Campo requerido' : ''}
							variant={'outlined'}
						/>
					</div>
				}
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
			<div className={'filter-buttons'}>
				{
					onExport &&
				<Button
					onClick={onExport}
					variant="contained"
					disabled={isLoading}
				>
					Exportar
				</Button>
				}
				<Button
					onClick={search}
					variant="outlined"
					disabled={isLoading}
				>
					Buscar
				</Button>
			</div>
		</div>
	)
}

export default IAFilters

IAFilters.defaultProps = {
	showWorkerFilter: false,
	defaultStartDate: null,
	onExport: null,
	onSearch: () => {},
	isLoading: false
}
