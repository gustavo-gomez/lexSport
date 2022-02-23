import React, {useEffect, useState} from 'react'
import '../scss/components/workers.scss'
import {useDispatch} from 'react-redux'
import IATextInput from "../common/IATextInput"
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import {createCostureraAPI, updateCostureraAPI} from "../utils/apiUtils"
import isEmpty from "lodash/isEmpty"
import isNaN from "lodash/isNaN"
import {getAllCostureras} from "../slices/workersSlice";
import IASwitch from "../common/IASwitch";

const NewWorker = ({hideSection, workerEdit, saveWorker}) => {

	const [worker, setWorker] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const dispatch = useDispatch()

	useEffect(() => {
		setWorker({...workerEdit})
		setErrors({})
	}, [workerEdit])

	const isValidForm = () => {
		let newErrors = {}

		if (isEmpty(worker?.firstName))
			newErrors.firstName = 'Nombres son requeridos'

		if (isEmpty(worker?.lastName))
			newErrors.lastName = 'Apellidos son requeridos'

		// if (isEmpty(worker?.phone))
		// 	newErrors.phone = 'Telefono es requerido'

		if (isNaN(worker?.phone))
			newErrors.phone = 'Telefono debe ser numerico'

		setErrors({...newErrors})
		console.log('validar: ', isEmpty(newErrors))
		return isEmpty(newErrors)
	}

	const newOrUpdateWorker = async () => {
		if (!isValidForm())
			return
		setIsLoading(true)

		if (worker?.id)
			await updateCostureraAPI(worker.id, worker)
		else
			await createCostureraAPI(worker)

		dispatch(getAllCostureras())
		setIsLoading(false)
		hideSection()
	}

	const onChange = (e) => {
		console.log(e.target.value)
		setWorker(prevState => ({
			...prevState, [e.target.name]: e.target.value
		}))
		setErrors(prevState => ({
			...prevState, [e.target.name]: ''
		}))
	}

	const handleChange = (event) => {
		setWorker(prevState => ({
			...prevState,
			oldWorker: event.target.checked
		}))
	}

	console.log('errors: ', errors)
	return (
		<div className='new-worker-container form'>
			<h3>{worker?.id ? 'Editar' : 'Nueva'} Costurera</h3>

			<IATextInput
				label='Nombres'
				name={'firstName'}
				value={worker?.firstName}
				isRequired
				onChangeText={onChange}
				error={!isEmpty(errors?.firstName)}
				helperText={errors?.firstName}
			/>

			<IATextInput
				label='Apellidos'
				name={'lastName'}
				value={worker?.lastName}
				isRequired
				onChangeText={onChange}
				error={!isEmpty(errors?.lastName)}
				helperText={errors?.lastName}
			/>

			<IATextInput
				label='Celular'
				name={'phone'}
				value={worker?.phone}
				type={'number'}
				onChangeText={onChange}
				error={!isEmpty(errors?.phone)}
				helperText={errors?.phone}
			/>

			<IASwitch
				checked={worker?.oldWorker}
				onChange={handleChange}
				label={'Costurera antigua'}
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

export default NewWorker
