import React, { useEffect, useState } from 'react'
import '../scss/components/newhistory.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts, products } from '../slices/productsSlice'
import IALoader from '../common/IALoader'
import { useDimension } from '../utils/useDimension'
import { getAllCostureras, workers } from '../slices/workersSlice'
import IASelect from '../common/IASelect'
import IATextInput from '../common/IATextInput'
import isEmpty from 'lodash/isEmpty'
import IATimeDatePicker from '../common/IATimeDatePicker'
import FloatingButton from '../common/FloatingButton'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import LoadingButton from '@mui/lab/LoadingButton'

const ACTIONS = {
	MAKE: 'fill',
	FILL: 'FILL',
}

const emptyRow = {
	workerId: '',
	productId: '',
	quantity: '',
	action: '',
	price: 0,
}

const NewHistory = () => {

	const { productList } = useSelector(products)
	const { workerList } = useSelector(workers)
	const [errors, setErrors] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [newHistoryData, setNewHistoryData] = useState([
		{ ...emptyRow }
	])

	const { width } = useDimension()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getAllProducts())
		dispatch(getAllCostureras())
	}, [])

	if (isLoading) {
		return (
			<IALoader/>
		)
	}

	const onChange = (index, name, value) => {
		const newData = [...newHistoryData]
		const newErrors = [...errors]
		newData[index][name] = value
		newErrors[index][name] = ''
		setNewHistoryData(newData)
		setErrors(newErrors)
	}

	const deleteRow = (index) => {
		const newData = [...newHistoryData]
		newData.splice(index, 1)
		setNewHistoryData(newData)
	}

	const isValidaForm = () => {
		let newErrors = []
		let hasError = false
		newHistoryData.forEach((row, index) => {
			let errorRow = { ...emptyRow }
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
			newErrors.push(errorRow)
			// if (row.action === '') {
			// 	setErrors({ ...errors, action: 'El campo es requerido' })
			// }

		})
		setErrors(newErrors)
		return hasError
	}

	const saveActivities = () => {
		isValidaForm()
	}

	console.log('newHistoryData', newHistoryData)
	console.log('newErrors', errors)

	return (
		<div
			className={'content-wrapper'}
		>
			<div className="history-container">
				<h2>Registrar Trabajo del dia</h2>
				<IATimeDatePicker
					handleChange={(value) => {
					}}
				/>
				{
					newHistoryData.map((item, index) => {
						return (
							<div
								key={index}
								className="history-row"
							>
								<IASelect
									label={'Costurera'}
									key={`workerId-${index}`}
									value={workerList.find(worker => worker.id === item.workerId)}
									data={workerList}
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
									value={productList.find(product => product.id === item.productId)}
									data={productList}
									textToShow={(object) => {
										return object?.name
									}}
									onChange={(object) => onChange(index, 'productId', object?.id)}
									error={!isEmpty(errors?.[index]?.productId)}
									helperText={errors?.[index]?.productId}
									isRequired
								/>
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
									<ClearOutlinedIcon style={{ color: 'red' }} onClick={() => deleteRow(index)}/>
								}
							</div>
						)
					})
				}
				<div className={'fab-container'}>
					<FloatingButton
						fixed={false}
						size={'small'}
						// style={{ alignSelf: 'start' }}
						onClick={() => setNewHistoryData(prevState => {
							return [
								...prevState,
								{ ...emptyRow }
							]
						})}
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
