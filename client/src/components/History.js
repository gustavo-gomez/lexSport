import React, { useState } from 'react'
import '../scss/components/history.scss'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import { useNavigate } from 'react-router-dom'
import FloatingButton from '../common/FloatingButton'
import IAFilters from '../common/IAFilters'
import { DATE_FORMAT, getEndDateMillis, getStartDateMillis, ROLES } from '../utils/utils'
import { deleteActivityAPI, loadActivitiesAPI } from '../utils/apiUtils'
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
		label: 'Hora',
		key: 'hour'
	},
	{
		label: 'Costurera',
		key: 'worker'
	},
	{
		label: 'Código Producto',
		key: 'productCode'
	},
	{
		label: 'Producto',
		key: 'product'
	},
	{
		label: 'Acción',
		key: 'action'
	},
	{
		label: 'Cantidad',
		key: 'quantity'
	},
	{
		label: 'Precio',
		key: 'price',
		onlyAdmin: true
	},
	{
		label: '',
		key: 'actions',
	},
]


const History = () => {

	const [history, setHistory] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [idToDelete, setIdToDelete] = useState(null)
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const [itemToEdit, setItemToEdit] = useState(null)
	const [openEditModal, setOpenEditModal] = useState(false)
	const [startDate, setStartDate] = useState(false)
	const [endDate, setEndDate] = useState(false)
	const navigate = useNavigate()

	const deleteItem = async () => {
		setIsLoading(true)
		await deleteActivityAPI(idToDelete)
		setOpenDeleteModal(false)
		setIdToDelete(null)
		await searchHistory({ startDate, endDate })
		setIsLoading(false)
	}

	const getTableBody = () => {
		return map(history, (historyItem, index) => {
			const { id, price, quantity, milliseconds, worker, product, action, productCode } = historyItem
			return {
				date: moment(milliseconds).format(DATE_FORMAT.DATE_HYPHEN_PERU),
				hour: moment(milliseconds).format(DATE_FORMAT.TIME_PERIOD_24),
				worker,
				productCode,
				product,
				action: action === ACTIONS.FILL ?
					<span style={{ color: 'green' }}>Relleno</span> :
					<span style={{ color: '#ffa111' }}>Confección</span>,
				quantity,
				price,
				actions: (
					<div
						style={{ display: 'flex' }}
					>
						<EditIcon
							className={'icon'}
							color="primary"
							onClick={() => {
								setItemToEdit(historyItem)
								setOpenEditModal(true)
							}}
							style={{ marginRight: '10px' }}
						/>
						<DeleteIcon
							className={'icon'}
							color="error"
							onClick={() => {
								setIdToDelete(id)
								setOpenDeleteModal(true)
							}}
						/>
					</div>
				)
			}
		})
	}

	const searchHistory = async ({ startDate, endDate, workerId }) => {
		setIsLoading(true)
		setStartDate(startDate)
		setEndDate(endDate)
		const startDateMillis = getStartDateMillis(startDate)
		const endDateMillis = getEndDateMillis(endDate)

		const response = await loadActivitiesAPI(startDateMillis, endDateMillis, workerId)
		if (response?.data?.activities?.length > 0) {
			setHistory(response?.data?.activities)
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
			<span className={'section-title'}>Historial de Trabajo</span>
			<IAFilters
				onSearch={searchHistory}
				isLoading={isLoading}
				showWorkerFilter
				rolesToShow={[ROLES.COSTURERA]}
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
			<IAModal
				isOpen={openDeleteModal}
				child={(
					<div
						className={'modal-delete card'}
					>
						<p>Esta seguro que desea eliminar el registro ?</p>
						<div className={'buttons'}>
							<Button
								onClick={() => {
									setOpenDeleteModal(false)
									setIdToDelete(null)
								}}
								variant="outlined"
								disabled={isLoading}
							>
								Cancelar
							</Button>
							<LoadingButton
								onClick={deleteItem}
								variant="outlined"
								color={'error'}
								loading={isLoading}
							>
								Eliminar
							</LoadingButton>
						</div>
					</div>
				)}
			/>
			<IAModal
				isOpen={openEditModal}
				child={(
					<div
						className={'modal-delete card'}
					>
						<h3>Editar Registro</h3>
						<EditHistory
							historyItem={itemToEdit}
							handleClose={async () => {
								setOpenEditModal(false)
								setItemToEdit(null)
								await searchHistory({ startDate, endDate })
							}}
						/>
					</div>
				)}
			/>
			<FloatingButton
				onClick={() => navigate('/historial/nuevo')}
			/>
		</div>
	)
}

export default History
