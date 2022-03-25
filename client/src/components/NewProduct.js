import React, {useEffect, useState} from 'react'
import '../scss/components/workers.scss'
import {useDispatch} from 'react-redux'
import IATextInput from "../common/IATextInput"
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import {createProductAPI, updateProductAPI} from "../utils/apiUtils"
import isEmpty from "lodash/isEmpty"
import isNaN from "lodash/isNaN"
import {getAllProducts} from "../slices/productsSlice";
import { useAlert } from 'react-alert'

const NewProduct = ({hideSection, productEdit}) => {

	const [product, setProduct] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const dispatch = useDispatch()
	const alert = useAlert()

	useEffect(() => {
		setProduct({...productEdit})
		setErrors({})
	}, [productEdit])

	const isValidForm = () => {
		let newErrors = {}

		if (isEmpty(product?.code))
			newErrors.code = 'Código es requerido'

		if (isEmpty(product?.name))
			newErrors.name = 'Nombre es requerido'

		if (isEmpty(product?.makingPriceHigh))
			newErrors.makingPriceHigh = 'Precio es requerido'

		if (isNaN(product?.makingPriceHigh))
			newErrors.makingPriceHigh = 'Precio debe ser numérico'

		if (isEmpty(product?.makingPriceLow))
			newErrors.makingPriceLow = 'Precio es requerido'

		if (isNaN(product?.makingPriceLow))
			newErrors.makingPriceLow = 'Precio debe ser numérico'

		setErrors({...newErrors})
		return isEmpty(newErrors)
	}

	const newOrUpdateWorker = async () => {
		if (!isValidForm())
			return
		setIsLoading(true)
		let response = {}
		if (product?.id)
			response = await updateProductAPI(product.id, product)
		else
			response = await createProductAPI(product)

		if (response?.isError)
			alert.error(response?.responseMessage)
		else
			alert.success('Se ha guardado el producto')

		dispatch(getAllProducts())
		setIsLoading(false)
		hideSection()
	}

	const onChange = (e) => {
		setProduct(prevState => ({
			...prevState, [e.target.name]: e.target.value
		}))
		setErrors(prevState => ({
			...prevState, [e.target.name]: ''
		}))
	}

	return (
		<div className='new-worker-container form'>
			<h3>{product?.id ? 'Editar' : 'Nuevo'} Producto</h3>

			<IATextInput
				label='Código'
				name={'code'}
				value={product?.code}
				isRequired
				onChangeText={onChange}
				error={!isEmpty(errors?.code)}
				helperText={errors?.code}
			/>

			<IATextInput
				label='Nombre producto'
				name={'name'}
				value={product?.name}
				isRequired
				onChangeText={onChange}
				error={!isEmpty(errors?.name)}
				helperText={errors?.name}
			/>

			<IATextInput
				label='Precio confección'
				name={'makingPriceHigh'}
				value={product?.makingPriceHigh}
				isRequired
				type={'number'}
				onChangeText={onChange}
				error={!isEmpty(errors?.makingPriceHigh)}
				helperText={errors?.makingPriceHigh}
			/>

			<IATextInput
				label='Precio confección bajo'
				name={'makingPriceLow'}
				value={product?.makingPriceLow}
				isRequired
				type={'number'}
				onChangeText={onChange}
				error={!isEmpty(errors?.makingPriceLow)}
				helperText={errors?.makingPriceLow}
			/>

			<IATextInput
				label='Precio de llenado'
				name={'fillPrice'}
				value={product?.fillPrice}
				type={'number'}
				placeholder={'0.00'}
				onChangeText={onChange}
				error={!isEmpty(errors?.fillPrice)}
				helperText={errors?.fillPrice || 'Dejar en blanco si no aplica'}
			/>

			<div className={'buttons'}>
				<Button
					onClick={() => hideSection()}
					variant="outlined"
					disabled={isLoading}
				>
					Cancelar
				</Button>
				<LoadingButton
					onClick={() => newOrUpdateWorker()}
					variant="outlined"
					loading={isLoading}
				>
					Guardar
				</LoadingButton>
			</div>

		</div>
	)
}

export default NewProduct
