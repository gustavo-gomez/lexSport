import React, { useState } from 'react'
import '../scss/components/history.scss'
import '../scss/components/shedule.scss'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import { useNavigate } from 'react-router-dom'
import FloatingButton from '../common/FloatingButton'
import IAFilters from '../common/IAFilters'
import { DATE_FORMAT, getEndDateMillis, getStartDateMillis, ROLES } from '../utils/utils'
import { loadSchedulesAPI, updateSchedulesAPI } from '../utils/apiUtils'
import moment from 'moment'
import EditIcon from '@mui/icons-material/Edit'
import { useSelector } from 'react-redux'
import { auth } from '../slices/authSlice'
import IATimePicker from '../common/IATimePicker'
import IAModal from '../common/IAModal'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

const tableHeader = [
	{
		label: 'Fecha',
		key: 'date'
	},
	{
		label: 'Trabajador',
		key: 'worker'
	},
	{
		label: 'Ingreso',
		key: 'enter'
	},
	{
		label: 'Refrigerio',
		key: 'break'
	},
	{
		label: 'Fin Refrigerio',
		key: 'endbreak'
	},
	{
		label: 'Salida',
		key: 'exit'
	},
	{
		label: 'Horas Trabajadas',
		key: 'workedHours'
	},
	{
		label: 'Horas Extras',
		key: 'extraHours'
	},
	{
		label: 'Horas Tardanza',
		key: 'lateHours'
	}
]

const Schedule = () => {

	const [history, setHistory] = useState([])
	const { loggedUser } = useSelector(auth)
	const isAdmin = loggedUser?.role === ROLES.ADMIN
	const [isLoading, setIsLoading] = useState(false)
	const [scheduleToEdit, setScheduleToEdit] = useState(null)
	const [filters, setFilters] = useState({})
	const navigate = useNavigate()

	const getTableBody = () => {
		return map(history, (historyItem, index) => {
			const {
				milliseconds,
				worker,
				enter,
				break: refrigerio,
				endbreak,
				exit,
				workedHours,
				extraHours,
				lateHours
			} = historyItem
			return {
				date: moment(milliseconds).format(DATE_FORMAT.DATE_HYPHEN_PERU),
				enter: enter && moment(enter).format(DATE_FORMAT.TIME_PERIOD_24),
				break: refrigerio && moment(refrigerio).format(DATE_FORMAT.TIME_PERIOD_24),
				endbreak: endbreak && moment(endbreak).format(DATE_FORMAT.TIME_PERIOD_24),
				exit: exit && moment(exit).format(DATE_FORMAT.TIME_PERIOD_24),
				worker,
				workedHours: workedHours === '00:00' ? '-' : workedHours,
				extraHours: extraHours === '00:00' ? '-' : extraHours,
				lateHours: lateHours === '00:00' ? '-' : lateHours,
				actions: isAdmin ? (
					<div
						style={{ display: 'flex' }}
					>
						<EditIcon
							className={'icon'}
							color="primary"
							onClick={() => {
								setScheduleToEdit({ ...historyItem })
							}}
							style={{ marginRight: '10px' }}
						/>
					</div>
				) : undefined
			}
		})
	}

	const searchHistory = async ({ startDate, endDate, workerId }) => {
		setIsLoading(true)
		const startDateMillis = getStartDateMillis(startDate)
		const endDateMillis = getEndDateMillis(endDate)
		setFilters({
			startDate,
			endDate,
			workerId
		})
		const response = await loadSchedulesAPI(startDateMillis, endDateMillis, workerId)
		if (response?.data?.schedules?.length > 0) {
			setHistory(response?.data?.schedules)
		} else {
			setHistory([])
		}
		setIsLoading(false)
	}

	const updateSchedule = async () => {
		setIsLoading(true)

		await updateSchedulesAPI(scheduleToEdit)
		await searchHistory({...filters})
		setIsLoading(false)
		setScheduleToEdit(null)
	}

	const onChangeDate = (value, key) => {
		console.log(new Date(value).getTime())
		setScheduleToEdit(prevState => (
			{
				...prevState,
				[key]: new Date(value).getTime()
			}
		))
	}

	return (
		<div
			className={'content-wrapper'}
			style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
		>
			<span className={'section-title'}>Historial de Horarios</span>
			<IAFilters
				onSearch={searchHistory}
				isLoading={isLoading}
				showWorkerFilter
				rolesToShow={[ROLES.JORNAL, ROLES.COSTURERA]}
				isWorkerRequired={false}
			/>
			<div
				className="history-table"
			>
				{
					isLoading ?
						<IALoader/> :
						(
							history?.length > 0 ?
								<CommonTable
									tableHeader={
										[
											...tableHeader,
											isAdmin ? {
												label: '',
												key: 'actions',
											} : {},
										]
									}
									body={getTableBody()}
									onClickRow={() => null}
								/> :
								<IALoader type={LOTTIE_TYPE.EMPTY}/>
						)
				}
			</div>
			<FloatingButton
				onClick={() => navigate('/horarios/nuevo')}
			/>
			<IAModal
				isOpen={scheduleToEdit !== null}
				child={
					<div
						className="edit-schedule-container card"
					>
						<span className="edit-schedule-title">Editar Horario</span>
						<span
							className="worker-edit"
						>
							{`Trabajador: ${scheduleToEdit?.worker}`}
						</span>
						<span
							className="date-edit"
						>
							{`Fecha: ${moment(scheduleToEdit?.milliseconds).format(DATE_FORMAT.DATE_HYPHEN_PERU)}`}
						</span>
						<IATimePicker
							label={'Hora de Ingreso'}
							value={new Date(scheduleToEdit?.enter)}
							handleChange={(value) => onChangeDate(value, 'enter')}
						/>
						<IATimePicker
							label={'Hora de Refrigerio'}
							value={new Date(scheduleToEdit?.break)}
							handleChange={(value) => onChangeDate(value, 'break')}
						/>
						<IATimePicker
							label={'Fin de Refrigerio'}
							value={new Date(scheduleToEdit?.endbreak)}
							handleChange={(value) => onChangeDate(value, 'endbreak')}
						/>
						<IATimePicker
							label={'Hora de Salida'}
							value={new Date(scheduleToEdit?.exit)}
							handleChange={(value) => onChangeDate(value, 'exit')}
						/>
						<div className={'buttons'}>
							<Button
								onClick={() => setScheduleToEdit(null)}
								variant="outlined"
								disabled={isLoading}
							>
								Cancelar
							</Button>
							<LoadingButton
								onClick={updateSchedule}
								variant="outlined"
								loading={isLoading}
							>
								Actualizar
							</LoadingButton>
						</div>
					</div>
				}
				handleClose={() => setScheduleToEdit(null)}
			/>
		</div>
	)
}

export default Schedule
