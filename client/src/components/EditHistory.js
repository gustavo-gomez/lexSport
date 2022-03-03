import React, { useEffect, useState } from 'react'
import '../scss/components/newhistory.scss'
import { useSelector } from 'react-redux'
import { products } from '../slices/productsSlice'
import { workers } from '../slices/workersSlice'
import IASelect from '../common/IASelect'
import IATextInput from '../common/IATextInput'
import isEmpty from 'lodash/isEmpty'
import LoadingButton from '@mui/lab/LoadingButton'
import { editActivityAPI } from '../utils/apiUtils'
import Button from '@mui/material/Button'

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

const EditHistory = ({ historyItem, handleClose }) => {
	const { productList } = useSelector(products)
	const { workerList } = useSelector(workers)
	const [errors, setErrors] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [history, setHistory] = useState({})

	useEffect(() => {
		setHistory({
			workerId: historyItem?.workerId,
			productId: historyItem?.productId,
			quantity: historyItem?.quantity,
			action: historyItem?.action,
			price: +(historyItem?.price),
			id: historyItem?.id,
		})
	}, [historyItem])

	const onChange = (name, value) => {
		const newHistory = { ...history }
		newHistory[name] = value
		setHistory(newHistory)
		setErrors(prevState => ({
			...prevState, [name]: ''
		}))
	}

	const isValidForm = () => {
		let newErrors = {}

		if (isEmpty(history?.workerId)) {
			newErrors.workerId = 'El campo es requerido'
		}
		if (isEmpty(history?.productId)) {
			newErrors.productId = 'El campo es requerido'
		}
		if (history?.quantity === '') {
			newErrors.quantity = 'El campo es requerido'
		}
		if (isEmpty(history?.action)) {
			newErrors.action = 'El campo es requerido'
		}

		setErrors({ ...newErrors })
		return isEmpty(newErrors)
	}

	const editActivity = async () => {
		if (!isValidForm())
			return
		setIsLoading(true)

		// calculate payments
		const currentProduct = productList.find(p => p.id === history.productId)
		const currentWorker = workerList.find(w => w.id === history.workerId)

		let pricexProduct
		if (history.action === ACTIONS.FILL) {
			pricexProduct = currentProduct?.fillPrice
		} else {
			if (currentWorker?.oldWorker) {
				pricexProduct = currentProduct?.makingPriceHigh
			} else {
				pricexProduct = currentProduct?.makingPriceLow
			}
		}

		await editActivityAPI({
			...history,
			quantity: +(history.quantity),
			price: history.quantity * pricexProduct
		})
		setIsLoading(false)
		handleClose()
	}

	const selectedProduct = productList.find(p => p.id === history?.productId)

	return (
		<div
			className={'modal-edit-history'}
		>
			<div className="history-container">
				{
					<div
						className="history-row"
					>
						<IASelect
							label={'Costurera'}
							key={`workerId`}
							value={workerList.find(worker => worker.id === history?.workerId)}
							data={workerList}
							textToShow={(object) => {
								return `${object?.firstName}, ${object?.lastName}`
							}}
							onChange={(object) => onChange('workerId', object?.id)}
							isRequired
							error={!isEmpty(errors?.workerId)}
							helperText={errors?.workerId}
						/>
						<IASelect
							label={'Producto'}
							key={`productId`}
							value={productList.find(p => p.id === history?.productId)}
							data={productList}
							textToShow={(object) => {
								return object?.name
							}}
							onChange={(object) => onChange('productId', object?.id)}
							error={!isEmpty(errors?.productId)}
							helperText={errors?.productId}
							isRequired
						/>
						{
							selectedProduct && selectedProduct?.fillPrice !== '0.00' &&
							<IASelect
								label={'Acción'}
								key={`action`}
								value={actionsData.find(action => action.id === history?.action)}
								data={actionsData}
								textToShow={(object) => {
									return object?.label
								}}
								onChange={(object) => onChange('action', object?.id)}
								error={!isEmpty(errors?.action)}
								helperText={errors?.action}
								isRequired
							/>
						}
						<IATextInput
							type={'number'}
							key={`quantity`}
							label="Cantidad"
							name={'quantity'}
							value={history?.quantity}
							isRequired
							onChangeText={(e) => onChange('quantity', e.target.value)}
							error={!isEmpty(errors?.quantity)}
							helperText={errors?.quantity}
						/>
					</div>
				}
				<div className={'buttons'}>
					<Button
						onClick={() => {
							handleClose()
						}}
						variant="outlined"
						disabled={isLoading}
					>
						Cancelar
					</Button>
					<LoadingButton
						onClick={editActivity}
						variant="outlined"
						loading={isLoading}
					>
						Actualizar
					</LoadingButton>
				</div>
			</div>
		</div>
	)
}

export default EditHistory
