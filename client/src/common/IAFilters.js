import React, { useEffect, useState } from 'react'
import IADatePicker from './IADatePicker'
import '../scss/components/iafilters.scss'
import Button from '@mui/material/Button'
import IASelect from './IASelect'
import isEmpty from 'lodash/isEmpty'
import { useDispatch, useSelector } from 'react-redux'
import { getWorkers, workers } from '../slices/workersSlice'

const IAFilters = ({
	                   onSearch,
	                   isLoading,
	                   showWorkerFilter,
	                   defaultStartDate,
	                   onExport,
	                   rolesToShow,
	                   isWorkerRequired,
                   }) => {

	const { activeWorkerList } = useSelector(workers)
	const [isError, setIsError] = useState(false)
	const [startDate, setStartDate] = useState(defaultStartDate || new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [selectedWorker, setSelectedWorker] = useState(null)
	const [workersToShow, setWorkersToShow] = useState([])

	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getWorkers({}))
	}, [])

	useEffect(() => {
		setWorkersToShow(activeWorkerList.filter(worker => rolesToShow.includes(worker?.role)))
	}, [activeWorkerList])

	const search = () => {
		if (showWorkerFilter && isWorkerRequired && isEmpty(selectedWorker)) {
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
							label={'Trabajador'}
							key={`worker-filter`}
							value={workersToShow?.find(worker => worker.id === selectedWorker?.id)}
							data={workersToShow}
							textToShow={(object) => {
								return `${object?.firstName}, ${object?.lastName}`
							}}
							onChange={(object) => {
								setIsError(false)
								setSelectedWorker(object)
							}}
							isRequired={isWorkerRequired}
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
					<IADatePicker
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
					<IADatePicker
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
	onSearch: () => {
	},
	isLoading: false,
	rolesToShow: [],
	isWorkerRequired: true,
}
