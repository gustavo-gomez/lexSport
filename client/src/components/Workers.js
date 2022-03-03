import React, { useEffect, useState } from 'react'
import '../scss/components/newworkers.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCostureras, workers } from '../slices/workersSlice'
import CommonTable from '../common/CommonTable'
import map from 'lodash/map'
import { MOBILE_WIDTH, scrollToTop, textToCamelCase } from '../utils/utils'
import FloatingButton from '../common/FloatingButton'
import NewWorker from './NewWorkers'
import IAModal from '../common/IAModal'
import { useDimension } from '../utils/useDimension'
import EditIcon from '@mui/icons-material/Edit'
import IALoader from '../common/IALoader'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteCostureraAPI, deleteProductAPI } from '../utils/apiUtils'
import { getAllProducts } from '../slices/productsSlice'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'

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
	const [workerEdit, setWorkerEdit] = useState(null)
	const [openDeleteModal, setOpenDeleteModal] = useState(false)
	const [idToDelete, setIdToDelete] = useState(null)
	const { width } = useDimension()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getAllCostureras())
	}, [])

	const getTableBody = () => {
		return map(activeWorkerList, ({ id, firstName, lastName, phone, oldWorker }, index) => {

			return {
				index: index + 1,
				name: textToCamelCase(`${lastName}, ${firstName}`),
				phone,
				oldWorker: oldWorker === 1 ? 'Si' : 'No',
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
		setWorkerEdit(activeWorkerList?.[index])
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
		await deleteCostureraAPI(idToDelete)
		setOpenDeleteModal(false)
		setIdToDelete(null)
		dispatch(getAllCostureras())
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
				<span className={'section-title'}>Lista de Costureras</span>
				{
					activeWorkerList?.length > 0 &&
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
			{/*<IAAlertMessage*/}
			{/*	severity={ALERT_MESSAGE_SEVERITY.SUCCESS}*/}
			{/*	message={'asdas'}*/}
			{/*/>*/}
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
						<p>Esta seguro que desea eliminar la costurera ?</p>
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
