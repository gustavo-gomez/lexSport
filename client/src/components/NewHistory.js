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
import { newActivitiesAPI } from '../utils/apiUtils'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../utils/utils'

const actionsData = [
	{
		label: 'Confección',
		id: 'make'
	},
	{
		label: 'Relleno',
		id: 'fill'
	}
]

export const ACTIONS = {
	MAKE: 'make',
	FILL: 'fill',
}

const emptyRow = {
	workerId: '',
	productId: '',
	quantity: '',
	action: 'make',
	price: 0,
}

const emptyError = {
	workerId: '',
	productId: '',
	quantity: '',
	action: '',
	price: '',
}

const NewHistory = () => {

	const { activeProductList } = useSelector(products)
	const { activeWorkerList } = useSelector(workers)
	const [errors, setErrors] = useState([{ ...emptyError }])
	const [isLoading, setIsLoading] = useState(false)
	const [activityDate, setActivityDate] = useState(new Date())
	const [newHistoryData, setNewHistoryData] = useState([
		{ ...emptyRow }
	])

	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		dispatch(getAllProducts())
		dispatch(getWorkers({roles: [ROLES.COSTURERA]}))
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
			if (row.workerId === '') {
				errorRow.workerId = 'El campo es requerido'
				hasError = true
			}
			if (row.productId === '') {
				errorRow.productId = 'El campo es requerido'
				hasError = true
			}
			if (row.quantity === '') {
				errorRow.quantity = 'El campo es requerido'
				hasError = true
			}
			if (showAction(index) && row.action === '') {
				errorRow.quantity = 'El campo es requerido'
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

		// calculate payments
		const newData = newHistoryData.map((historyItem, index) => {
			const currentProduct = activeProductList.find(p => p.id === historyItem.productId)
			const currentWorker = activeWorkerList.find(w => w.id === historyItem.workerId)

			let pricexProduct
			if (historyItem.action === ACTIONS.FILL) {
				pricexProduct = currentProduct?.fillPrice
			} else {
				if (currentWorker?.oldWorker) {
					pricexProduct = currentProduct?.makingPriceHigh
				} else {
					pricexProduct = currentProduct?.makingPriceLow
				}
			}

			return {
				...historyItem,
				price: historyItem.quantity * pricexProduct
			}
		})
		await newActivitiesAPI(activityDate.getTime(), newData)
		setIsLoading(false)
		navigate('/historial')
	}

	// show action select (make, fill) only if the product has fill price
	const showAction = (product) => {
		return product && product?.fillPrice !== '0.00'
	}

	return (
		<div
			className={'content-wrapper'}
		>
			<div className="history-container">
				<h2>Registrar Trabajo del dia</h2>
				<IATimeDatePicker
					value={activityDate}
					handleChange={(value) => {
						setActivityDate(new Date(value))
					}}
				/>
				{
					newHistoryData.map((item, index) => {
						const selectedProduct = activeProductList.find(p => p.id === item.productId)
						return (
							<div
								key={index}
								className="history-row card"
							>
								<IASelect
									label={'Costurera'}
									key={`workerId-${index}`}
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
									label={'Producto'}
									key={`productId-${index}`}
									value={selectedProduct}
									data={activeProductList}
									textToShow={(object) => {
										return object?.name
									}}
									onChange={(object) => onChange(index, 'productId', object?.id)}
									error={!isEmpty(errors?.[index]?.productId)}
									helperText={errors?.[index]?.productId}
									isRequired
								/>
								{
									showAction(selectedProduct) &&
									<IASelect
										label={'Acción'}
										key={`action-${index}`}
										value={actionsData.find(action => action.id === item.action)}
										data={actionsData}
										textToShow={(object) => {
											return object?.label
										}}
										onChange={(object) => onChange(index, 'action', object?.id)}
										error={!isEmpty(errors?.[index]?.action)}
										helperText={errors?.[index]?.action}
										isRequired
									/>
								}
								<IATextInput
									type={'number'}
									key={`quantity-${index}`}
									label="Cantidad"
									name={'quantity'}
									value={item?.quantity}
									isRequired
									onChangeText={(e) => onChange(index, 'quantity', e.target.value)}
									error={!isEmpty(errors?.[index]?.quantity)}
									helperText={errors?.[index]?.quantity}
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

export default NewHistory
