import React, { useEffect, useState } from 'react'
import '../scss/components/newworkers.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getAllCostureras, workers } from '../slices/workersSlice'
import CommonTable from '../common/CommonTable'
import map from 'lodash/map'
import { MOBILE_WIDTH, textToCamelCase } from '../utils/utils'
import FloatingButton from '../common/FloatingButton'
import NewWorker from './NewWorkers'
import IAModal from '../common/IAModal'
import { useDimension } from '../utils/useDimension'
import EditIcon from '@mui/icons-material/Edit'
import IALoader from '../common/IALoader'

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
	const { workerList, isLoading } = useSelector(workers)
	const [showNewUserForm, setShowNewUserForm] = useState(false)
	const [workerEdit, setWorkerEdit] = useState(null)

	const { width } = useDimension()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getAllCostureras())
	}, [])

	const getTableBody = () => {
		return map(workerList, ({ firstName, lastName, phone, oldWorker }, index) => {

			return {
				index: index + 1,
				name: textToCamelCase(`${lastName}, ${firstName}`),
				phone,
				oldWorker: oldWorker === 1 ? 'Si' : 'No',
				actions: (
					<>
						<EditIcon
							className={'icon'}
							color="primary"
							onClick={() => handleEdit(index)}
						/>
					</>
				)
			}
		})
	}

	const handleEdit = (index) => {
		setWorkerEdit(workerList?.[index])
		setShowNewUserForm(true)
		window.scrollTo(0, 0)
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
			{/*<IAAlertMessage*/}
			{/*	severity={ALERT_MESSAGE_SEVERITY.SUCCESS}*/}
			{/*	message={'asdas'}*/}
			{/*/>*/}
			{
				!showNewUserForm &&
				<FloatingButton
					onClick={() => setShowNewUserForm(true)}
				/>
			}
		</div>
	)
}

export default Workers
