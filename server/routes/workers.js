import { Router } from 'express'
import {
	deleteCostureraService,
	loadWorkerByIdService,
	loadWorkersByRoleService,
	newWorkerService,
	updateCostureraService
} from '../services/workerService.js'
import {
	getGenericMessage,
	getSuccessResponse,
	HTTP_STATUS_CODES,
	ROLES,
	validationErrorsToArray
} from '../utils/utils.js'
import { hashPassword, verifyAuthJWToken, verifyAuthJWTokenIsAdmin } from '../utils/passUtils.js'
import { check, validationResult } from 'express-validator'
import isEmpty from 'lodash/isEmpty'

const router = Router()

//get all workers
router.get('/', [verifyAuthJWToken], async (req, res) => {
	try {
		const { roles } = req.query
		const rolesToFilter = roles?.split(',') || []
		const workers = await loadWorkersByRoleService(rolesToFilter)

		return res.json(getSuccessResponse({ workers }))
	} catch ( e ) {
		console.log('Error: ', e)
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

const newUserFormValidator = [
	check('worker.firstName', 'Nombres es requerido').exists(),
	check('worker.lastName', 'Apellidos es requerido').exists(),
	check('worker.role', 'Tipo de trabajador es requerido').exists()
]

//new worker
router.post('/', [newUserFormValidator, verifyAuthJWTokenIsAdmin], async (req, res) => {
	try {

		const { errors } = validationResult(req)

		if (!isEmpty(errors))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))

		const { worker } = req.body

		if(worker?.role === ROLES.OPERATOR && isEmpty(worker?.password))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(['Contraseña es requerida']))

		console.log('worker: ', worker)
		await newWorkerService(worker)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Costurera creada con éxito'))
	} catch ( e ) {
		console.log('Error: ', e)
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

const updateUserFormValidator = [
	check('worker.firstName', 'Nombres es requerido').exists(),
	check('worker.lastName', 'Apellidos es requerido').exists(),
	check('worker.role', 'Tipo de trabajador es requerido').exists(),
]
//update costurera
router.put('/:id', [updateUserFormValidator, verifyAuthJWTokenIsAdmin], async (req, res) => {
	try {

		const { errors } = validationResult(req)

		if (!isEmpty(errors))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))

		const { id } = req.params
		const { worker } = req.body

		const workerDB = await loadWorkerByIdService(id)

		if (isEmpty(workerDB?.[0]))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage('Costurera no encontrada'))

		//changing operator password
		let newPassword = null
		if(worker?.role === ROLES.OPERATOR && !isEmpty(worker?.password)){
			newPassword = hashPassword(worker.password)
		}
		await updateCostureraService(id, { ...worker, password: newPassword })

		return res.status(HTTP_STATUS_CODES.OK).json(getGenericMessage('Costurera actualizada con exito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.send(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

router.delete('/:id', [verifyAuthJWToken], async (req, res) => {
	try {
		const { id } = req.params

		await deleteCostureraService(id)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Costurera eliminada con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

export default router



