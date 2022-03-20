import React, { useEffect, useState } from 'react'
import '../scss/components/workers.scss'
import '../scss/components/newworkers.scss'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import FloatingButton from '../common/FloatingButton'
import { MOBILE_WIDTH, OPERATOR_ROLES_TEXT, ROLES, scrollToTop, textToCamelCase } from '../utils/utils'
import { deleteCostureraAPI } from '../utils/apiUtils'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import IAModal from '../common/IAModal'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { getWorkers, workers } from '../slices/workersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useDimension } from '../utils/useDimension'
import NewWorker from './NewWorkers'

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
		label: 'Teléfono',
		key: 'phone'
	},
	{
		label: 'Rol',
		key: 'role'
	},
	{
		label: 'Usuario',
		key: 'user'
	},
	{
		label: '',
		key: 'actions'
	},
]

const Operators = () => {

	const [showNewUserForm, setShowNewUserForm] = useState(false)
	const [idToDelete, setIdToDelete] = useState(null)
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const [workerEdit, setWorkerEdit] = useState(null)
	const [operatorsList, setOperatorsList] = useState([])
	const { activeWorkerList, isLoading } = useSelector(workers)
	const { width } = useDimension()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getWorkers({ roles: [ROLES.OPERATOR] }))
	}, [])

	useEffect(() => {
		setOperatorsList(activeWorkerList.filter(worker => worker.role === ROLES.OPERATOR))
	}, [activeWorkerList])

	const getTableBody = () => {
		return map(operatorsList, ({ id, firstName, lastName, phone, user, role, permission }, index) => {
			return {
				index: index + 1,
				name: textToCamelCase(`${lastName}, ${firstName}`),
				role: OPERATOR_ROLES_TEXT[permission],
				phone,
				user,
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

	const deleteWorker = async () => {
		await deleteCostureraAPI(idToDelete)
		setOpenDeleteModal(false)
		setIdToDelete(null)
		dispatch(getWorkers({ roles: [ROLES.OPERATOR] }))
	}

	const cancelEdit = () => {
		setWorkerEdit(null)
		setShowNewUserForm(false)
	}

	const newWorkerForm = (
		<NewWorker
			hideSection={() => cancelEdit()}
			workerEdit={workerEdit}
			isOperator={true}
		/>
	)

	const handleEdit = (index) => {
		setWorkerEdit(operatorsList?.[index])
		setShowNewUserForm(true)
		scrollToTop()
	}

	return (
		<div
			className={'content-wrapper'}
		>
			<div className="users-table">
				<span className={'section-title'}>Lista de Operarios</span>
				{
					operatorsList?.length > 0 &&
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

export default Operators
