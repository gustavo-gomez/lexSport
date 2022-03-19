import React, { useEffect, useState } from 'react'
import '../scss/components/newhistory.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts, products } from '../slices/productsSlice'
import IALoader from '../common/IALoader'
import { getWorkers, workers } from '../slices/workersSlice'
import IASelect from '../common/IASelect'
import IATextInput from '../common/IATextInput'
import isEmpty from 'lodash/isEmpty'
import IATimeDatePicker from '../common/IATimeDatePicker'
import FloatingButton from '../common/FloatingButton'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import LoadingButton from '@mui/lab/LoadingButton'
import { newActivitiesAPI, newSchedulesAPI } from '../utils/apiUtils'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../utils/utils'

const actionOptions = [
	{
		label: 'Ingreso',
		id: 'enter'
	},
	{
		label: 'Refrigerio',
		id: 'break'
	},
	{
		label: 'Fin Refrigerio',
		id: 'endbreak'
	},
	{
		label: 'Salida',
		id: 'exit'
	}
]

const emptyRow = {
	workerId: '',
	action: 'enter',
}

const emptyError = {
	workerId: '',
	action: '',
}

const NewSchedule = () => {

	const { activeWorkerList } = useSelector(workers)
	const [errors, setErrors] = useState([{ ...emptyError }])
	const [isLoading, setIsLoading] = useState(false)
	const [newHistoryData, setNewHistoryData] = useState([
		{ ...emptyRow }
	])

	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getWorkers({ roles: [ROLES.JORNAL] }))
	}, [])

	if (isLoading) {
		return (
			<IALoader/>
		)
	}

	const onChange = (index, name, value) => {
		const newData = [...newHistoryData]
		newData[index][name] = value
		setNewHistoryData(newData)
	}

	const deleteRow = (index) => {
		const newData = [...newHistoryData]
		newData.splice(index, 1)

		const newErrors = [...errors]
		newErrors.splice(index, 1)

		setErrors(newErrors)
		setNewHistoryData(newData)

	}

	const isValidaForm = () => {
		let newErrors = []
		let hasError = false
		newHistoryData.forEach((row, index) => {
			let errorRow = { ...emptyError }
			if (isEmpty(row.workerId)) {
				errorRow.workerId = 'El campo es requerido'
				hasError = true
			}
			if (isEmpty(row.action)) {
				errorRow.action = 'El campo es requerido'
				hasError = true
			}
			newErrors.push(errorRow)
		})
		setErrors(newErrors)
		return !hasError
	}

	const saveActivities = async () => {
		if (!isValidaForm())
			return
		setIsLoading(true)

		await newSchedulesAPI(newHistoryData)
		setIsLoading(false)
		navigate('/horarios')
	}
	console.log(errors)
	console.log('newHistoryData', newHistoryData)
	return (
		<div
			className={'content-wrapper'}
		>
			<div className="history-container">
				<h2>Registrar Actividad</h2>
				{
					newHistoryData.map((item, index) => {
						return (
							<div
								key={index}
								className="history-row card"
							>
								<IASelect
									label={'Trabajador'}
									value={activeWorkerList.find(worker => worker.id === item.workerId)}
									data={activeWorkerList}
									textToShow={(object) => {
										return `${object?.firstName}, ${object?.lastName}`
									}}
									onChange={(object) => onChange(index, 'workerId', object?.id)}
									isRequired
									error={!isEmpty(errors?.[index]?.workerId)}
									helperText={errors?.[index]?.workerId}
								/>

								<IASelect
									label={'Acción'}
									value={actionOptions.find(action => action.id === item.action)}
									data={actionOptions}
									textToShow={(object) => {
										return object?.label
									}}
									onChange={(object) => onChange(index, 'action', object?.id)}
									isRequired
									error={!isEmpty(errors?.[index]?.action)}
									helperText={errors?.[index]?.action}
								/>

								{
									!isEmpty(item?.id) &&
									<IATextInput
										key={`price-${index}`}
										label="Precio"
										name={'price'}
										value={item?.price}
										disabled
									/>
								}
								{
									index !== 0 &&
									<CancelOutlinedIcon
										className={'delete-row'}
										style={{ color: 'red' }}
										onClick={() => deleteRow(index)}
									/>
								}
							</div>
						)
					})
				}
				<div className={'fab-container'}>
					<FloatingButton
						fixed={false}
						size={'small'}
						onClick={() => {
							setNewHistoryData(prevState => {
								return [
									...prevState,
									{ ...emptyRow }
								]
							})

							setErrors(prevState => {
								return [
									...prevState,
									{ ...emptyError }
								]
							})
						}
						}
					/>
					<LoadingButton
						onClick={() => saveActivities()}
						variant="outlined"
						loading={isLoading}
					>
						Guardar
					</LoadingButton>
				</div>
			</div>
		</div>
	)
}

export default NewSchedule
