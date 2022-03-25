import React, { useEffect, useState } from 'react'
import '../scss/components/newworkers.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getWorkers, workers } from '../slices/workersSlice'
import CommonTable from '../common/CommonTable'
import map from 'lodash/map'
import { MOBILE_WIDTH, ROLES, scrollToTop, textToCamelCase } from '../utils/utils'
import FloatingButton from '../common/FloatingButton'
import NewWorker from './NewWorkers'
import IAModal from '../common/IAModal'
import { useDimension } from '../utils/useDimension'
import EditIcon from '@mui/icons-material/Edit'
import IALoader from '../common/IALoader'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteCostureraAPI } from '../utils/apiUtils'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { useAlert } from 'react-alert'

const tableHeader = [
	{
		label: '',
		key: 'index'
	},
	{
		label: 'Nombre',
		key: 'name'
	},
	{
		label: 'Tipo',
		key: 'role'
	},
	{
		label: 'Teléfono',
		key: 'phone'
	},
	{
		label: 'Experiencia',
		key: 'oldWorker'
	},
	{
		label: '',
		key: 'actions'
	},
]

const Workers = () => {
	const { activeWorkerList, isLoading } = useSelector(workers)
	const [showNewUserForm, setShowNewUserForm] = useState(false)
	const [workerList, setWorkerList] = useState([])
	const [workerEdit, setWorkerEdit] = useState(null)
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const [idToDelete, setIdToDelete] = useState(null)
	const { width } = useDimension()
	const dispatch = useDispatch()
	const alert = useAlert()

	useEffect(() => {
		dispatch(getWorkers({}))
	}, [])

	useEffect(() => {
		setWorkerList(activeWorkerList.filter(worker => worker.role === ROLES.COSTURERA || worker.role === ROLES.JORNAL))
	}, [activeWorkerList])

	const getTableBody = () => {
		return map(workerList, ({ id, firstName, lastName, phone, oldWorker, role }, index) => {
			const isCostuera = role === ROLES.COSTURERA
			return {
				index: index + 1,
				name: textToCamelCase(`${lastName}, ${firstName}`),
				role: isCostuera ?
					<span style={{ color: '#e32d89' }}>Costurera</span> :
					<span style={{ color: '#0f4ee0' }}>Jornalero</span>,
				phone,
				oldWorker: isCostuera ? (oldWorker === 1 ? 'Si' : 'No') : '-',
				actions: (
					<div
						style={{ display: 'flex' }}
					>
						<EditIcon
							className={'icon'}
							color="primary"
							onClick={() => handleEdit(index)}
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

	const handleEdit = (index) => {
		setWorkerEdit(workerList?.[index])
		setShowNewUserForm(true)
		scrollToTop()
	}

	const cancelEdit = () => {
		setWorkerEdit(null)
		setShowNewUserForm(false)
	}

	const newWorkerForm = (
		<NewWorker
			hideSection={() => cancelEdit()}
			workerEdit={workerEdit}
		/>
	)

	const deleteWorker = async () => {
		const response = await deleteCostureraAPI(idToDelete)

		if (response?.isError)
			alert.error(response?.responseMessage)
		else
			alert.success('Se ha eliminado el trabajador')

		setOpenDeleteModal(false)
		setIdToDelete(null)
		dispatch(getWorkers({}))
	}

	if (isLoading) {
		return (
			<IALoader/>
		)
	}

	return (
		<div
			className={'content-wrapper'}
		>

			<div className="users-table">
				<span className={'section-title'}>Lista de Trabajadores</span>
				{
					workerList?.length > 0 &&
					<CommonTable
						tableHeader={tableHeader}
						body={getTableBody()}
					/>
				}
			</div>
			{
				width >= MOBILE_WIDTH ?
					(
						showNewUserForm &&
						<div
							className={'new-worker-section'}
						>
							{newWorkerForm}
						</div>
					) :
					<IAModal
						isOpen={showNewUserForm}
						child={newWorkerForm}
						handleClose={cancelEdit}
					/>
			}
			{
				!showNewUserForm &&
				<FloatingButton
					onClick={() => {
						setShowNewUserForm(true)
						scrollToTop()
					}}
				/>
			}
			<IAModal
				isOpen={openDeleteModal}
				child={(
					<div
						className={'modal-delete card'}
					>
						<p>Esta seguro que desea eliminar al trabajador ?</p>
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
								onClick={deleteWorker}
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
		</div>
	)
}

export default Workers
