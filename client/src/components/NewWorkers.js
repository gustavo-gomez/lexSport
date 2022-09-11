import React, { useEffect, useState } from 'react'
import '../scss/components/workers.scss'
import { useDispatch } from 'react-redux'
import IATextInput from '../common/IATextInput'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { createCostureraAPI, updateCostureraAPI } from '../utils/apiUtils'
import isEmpty from 'lodash/isEmpty'
import isNaN from 'lodash/isNaN'
import { getWorkers } from '../slices/workersSlice'
import IASwitch from '../common/IASwitch'
import IASelect from '../common/IASelect'
import { OPERATOR_ROLES, OPERATOR_ROLES_TEXT, ROLES } from '../utils/utils'
import { useAlert } from 'react-alert'

const rolesOptions = [
	{
		id: ROLES.COSTURERA,
		label: ROLES.COSTURERA
	},
	{
		id: ROLES.JORNAL,
		label: ROLES.JORNAL
	}
]

const permissions = [
	{
		id: OPERATOR_ROLES.MAKES,
		label: OPERATOR_ROLES_TEXT[OPERATOR_ROLES.MAKES]
	},
	{
		id: OPERATOR_ROLES.FILL,
		label: OPERATOR_ROLES_TEXT[OPERATOR_ROLES.FILL]
	},
	{
		id: OPERATOR_ROLES.SCHEDULE,
		label: OPERATOR_ROLES_TEXT[OPERATOR_ROLES.SCHEDULE]
	},
]

const NewWorker = ({ hideSection, workerEdit, isOperator = false }) => {

	const [worker, setWorker] = useState({})
	const [isLoading, setIsLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const [isEdit, setIsEdit] = useState(false)
	const [changePassword, setChangePassword] = useState(false)
	const dispatch = useDispatch()
	const alert = useAlert()

	useEffect(() => {
		setWorker({ ...workerEdit })
		setErrors({})
		if (!isEmpty(workerEdit)) setIsEdit(true)
	}, [workerEdit])

	const isValidForm = () => {
		let newErrors = {}

		if (isEmpty(worker?.firstName))
			newErrors.firstName = 'Nombres son requeridos'

		if (isEmpty(worker?.lastName))
			newErrors.lastName = 'Apellidos son requeridos'

		if (isNaN(worker?.phone))
			newErrors.phone = 'Telefono debe ser numerico'

		if (!isOperator && isEmpty(worker?.role))
			newErrors.role = 'Tipo de trabajadores requerido'

		if (isOperator) {
			if (isEmpty(worker?.permission))
				newErrors.permission = 'Rol del trabajador requerido'

			if (isEmpty(worker?.user))
				newErrors.user = 'Usuario requerido'

			if (!isEdit && isEmpty(worker?.password))
				newErrors.password = 'Contraseña requerida'

			if (isEdit && changePassword && isEmpty(worker?.password))
				newErrors.password = 'Contraseña requerida'
		}

		setErrors({ ...newErrors })
		return isEmpty(newErrors)
	}

	const newOrUpdateWorker = async () => {
		if (!isValidForm())
			return
		setIsLoading(true)
		let response = {}
		if (worker?.id)
			response = await updateCostureraAPI(worker.id, worker)
		else
			response = await createCostureraAPI({ ...worker, role: isOperator ? ROLES.OPERATOR : worker.role })

		if (response?.isError)
			alert.error(response?.responseMessage)
		else
			alert.success('Se ha guardado el trabajador')

		dispatch(getWorkers({}))
		setIsLoading(false)
		hideSection()
	}

	const onChange = (e) => {
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
			[event.target.name]: event.target.checked
		}))
	}

	const onChangeSelect = (name, value) => {
		setWorker(prevState => ({
			...prevState,
			[name]: value
		}))
		setErrors(prevState => ({
			...prevState,
			[name]: ''
		}))
	}

	const updatePermissions = (selectedPerms) => {
		console.log('selectedPerms: ', selectedPerms)

		setWorker(prevState => ({
			...prevState,
			permission: selectedPerms?.map(perm => perm.id).join(',')
		}))
		setErrors(prevState => ({
			...prevState,
			permission: ''
		}))
	}

	// support multiple select
	const workerPermissions = worker.permission?.split(',')
	const perm = permissions?.filter(permission => workerPermissions?.includes(permission.id))

	return (
		<div className="new-worker-container form">
			<h3>{worker?.id ? 'Editar' : 'Nuevo'} {isOperator ? 'Operario' : 'Trabajador'}</h3>

			<IATextInput
				label="Nombres"
				name={'firstName'}
				value={worker?.firstName}
				isRequired
				onChangeText={onChange}
				error={!isEmpty(errors?.firstName)}
				helperText={errors?.firstName}
			/>

			<IATextInput
				label="Apellidos"
				name={'lastName'}
				value={worker?.lastName}
				isRequired
				onChangeText={onChange}
				error={!isEmpty(errors?.lastName)}
				helperText={errors?.lastName}
			/>

			<IATextInput
				label="Celular"
				name={'phone'}
				value={worker?.phone}
				type={'number'}
				onChangeText={onChange}
				error={!isEmpty(errors?.phone)}
				helperText={errors?.phone}
			/>
			{
				!isEdit && !isOperator &&
				<IASelect
					label={'Tipo de trabajador'}
					value={rolesOptions.find(option => option.id === worker?.role)}
					data={rolesOptions}
					textToShow={(object) => {
						return object?.label?.toUpperCase()
					}}
					onChange={(object) => onChangeSelect('role', object?.id)}
					error={!isEmpty(errors?.role)}
					helperText={errors?.role}
					isRequired
				/>
			}
			{
				isOperator &&
				<>
					<IATextInput
						label="Nombre Usuario para login"
						name={'user'}
						value={worker?.user}
						type={'text'}
						onChangeText={onChange}
						error={!isEmpty(errors?.user)}
						helperText={errors?.user}
						isRequired
					/>
					<IASelect
						label={'Rol del operador'}
						value={perm}
						data={permissions}
						textToShow={(object) => object?.label}
						onChange={(selectedPerms) => updatePermissions(selectedPerms)}
						error={!isEmpty(errors?.permission)}
						helperText={errors?.permission}
						isRequired
						multiple
					/>
					{
						isEdit ?
							<>
								<IASwitch
									name={'changePassword'}
									checked={changePassword}
									onChange={(e) => setChangePassword(e.target.checked)}
									label={'Cambiar clave'}
								/>
								{
									changePassword &&
									<IATextInput
										label="Clave"
										name={'password'}
										value={worker?.password}
										type={'password'}
										onChangeText={onChange}
										error={!isEmpty(errors?.password)}
										helperText={errors?.password}
										isRequired
									/>
								}
							</> :
							<IATextInput
								label="Clave"
								name={'password'}
								value={worker?.password}
								type={'password'}
								onChangeText={onChange}
								error={!isEmpty(errors?.password)}
								helperText={errors?.password}
								isRequired
							/>
					}
				</>
			}
			{
				worker?.role === ROLES.COSTURERA &&
				<IASwitch
					name={'oldWorker'}
					checked={worker?.oldWorker}
					onChange={handleChange}
					label={'Costurera con experiencia'}
				/>
			}

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
