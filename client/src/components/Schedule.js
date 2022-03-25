import React, { useState } from 'react'
import '../scss/components/history.scss'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import { useNavigate } from 'react-router-dom'
import FloatingButton from '../common/FloatingButton'
import IAFilters from '../common/IAFilters'
import {
	DATE_FORMAT,
	getEndDateMillis,
	getStartDateMillis, ROLES,
	SCHEDULE_ACTIONS,
	SCHEDULE_ACTIONS_TEXT
} from '../utils/utils'
import { deleteActivityAPI, loadActivitiesAPI, loadSchedulesAPI } from '../utils/apiUtils'
import { ACTIONS } from './NewHistory'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IAModal from '../common/IAModal'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import EditHistory from './EditHistory'
import moment from 'moment'

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
	const [isLoading, setIsLoading] = useState(false)
	const [idToDelete, setIdToDelete] = useState(null)
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const [itemToEdit, setItemToEdit] = useState(null)
	const [openEditModal, setOpenEditModal] = useState(false)
	const [startDate, setStartDate] = useState(false)
	const [endDate, setEndDate] = useState(false)
	const navigate = useNavigate()

	// const deleteItem = async () => {
	// 	setIsLoading(true)
	// 	await deleteActivityAPI(idToDelete)
	// 	setOpenDeleteModal(false)
	// 	setIdToDelete(null)
	// 	await searchHistory({ startDate, endDate })
	// 	setIsLoading(false)
	// }
	const getAction = (action) => {

	}

	const getTableBody = () => {
		return map(history, (historyItem, index) => {
			const { milliseconds, worker, enter, break: refrigerio, endbreak, exit, workedHours, extraHours, lateHours } = historyItem
			return {
				date: moment(milliseconds).format(DATE_FORMAT.DATE_HYPHEN_PERU),
				// hour: moment(milliseconds).format(DATE_FORMAT.TIME_PERIOD_24),
				enter: enter && moment(enter).format(DATE_FORMAT.TIME_PERIOD_24),
				break: refrigerio && moment(refrigerio).format(DATE_FORMAT.TIME_PERIOD_24),
				endbreak: endbreak && moment(endbreak).format(DATE_FORMAT.TIME_PERIOD_24),
				exit: exit && moment(exit).format(DATE_FORMAT.TIME_PERIOD_24),
				worker,
				workedHours: workedHours === '00:00' ? '-' : workedHours,
				extraHours: extraHours === '00:00' ? '-' : extraHours,
				lateHours: lateHours === '00:00' ? '-' : lateHours,
			}
		})
	}

	const searchHistory = async ({ startDate, endDate, workerId }) => {
		setIsLoading(true)
		setStartDate(startDate)
		setEndDate(endDate)
		const startDateMillis = getStartDateMillis(startDate)
		const endDateMillis = getEndDateMillis(endDate)

		const response = await loadSchedulesAPI(startDateMillis, endDateMillis, workerId)
		if (response?.data?.schedules?.length > 0) {
			setHistory(response?.data?.schedules)
		} else {
			setHistory([])
		}
		setIsLoading(false)
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
				rolesToShow={[ROLES.JORNAL]}
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
									tableHeader={tableHeader}
									body={getTableBody()}
									onClickRow={() => null}
								/> :
								<IALoader type={LOTTIE_TYPE.EMPTY}/>
						)
				}
			</div>
			{/*<IAModal*/}
			{/*	isOpen={openDeleteModal}*/}
			{/*	child={(*/}
			{/*		<div*/}
			{/*			className={'modal-delete card'}*/}
			{/*		>*/}
			{/*			<p>Esta seguro que desea eliminar el registro ?</p>*/}
			{/*			<div className={'buttons'}>*/}
			{/*				<Button*/}
			{/*					onClick={() => {*/}
			{/*						setOpenDeleteModal(false)*/}
			{/*						setIdToDelete(null)*/}
			{/*					}}*/}
			{/*					variant="outlined"*/}
			{/*					disabled={isLoading}*/}
			{/*				>*/}
			{/*					Cancelar*/}
			{/*				</Button>*/}
			{/*				<LoadingButton*/}
			{/*					onClick={deleteItem}*/}
			{/*					variant="outlined"*/}
			{/*					color={'error'}*/}
			{/*					loading={isLoading}*/}
			{/*				>*/}
			{/*					Eliminar*/}
			{/*				</LoadingButton>*/}
			{/*			</div>*/}
			{/*		</div>*/}
			{/*	)}*/}
			{/*/>*/}
			{/*<IAModal*/}
			{/*	isOpen={openEditModal}*/}
			{/*	child={(*/}
			{/*		<div*/}
			{/*			className={'modal-delete card'}*/}
			{/*		>*/}
			{/*			<h3>Editar Registro</h3>*/}
			{/*			<EditHistory*/}
			{/*				historyItem={itemToEdit}*/}
			{/*				handleClose={async () => {*/}
			{/*					setOpenEditModal(false)*/}
			{/*					setItemToEdit(null)*/}
			{/*					await searchHistory({ startDate, endDate })*/}
			{/*				}}*/}
			{/*			/>*/}
			{/*		</div>*/}
			{/*	)}*/}
			{/*/>*/}
			<FloatingButton
				onClick={() => navigate('/horarios/nuevo')}
			/>
		</div>
	)
}

export default Schedule
