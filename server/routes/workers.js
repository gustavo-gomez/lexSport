import {Router} from 'express'
import {
	loadAllCosturerasService,
	loadWorkerByIdService,
	newCostureraService,
	updateCostureraService
} from "../services/workerService.js"
import {getGenericMessage, getSuccessResponse, HTTP_STATUS_CODES, validationErrorsToArray} from "../utils/utils.js"
import {verifyAuthJWTokenMiddleware} from "../utils/passUtils.js"
import {check, validationResult} from 'express-validator'
import isEmpty from "lodash/isEmpty"

const router = Router()

//get all costureras
router.get('/', [verifyAuthJWTokenMiddleware], async (req, res) => {
	try {
		const costureras = await loadAllCosturerasService()

		return res.json(getSuccessResponse({costureras}))
	} catch (e) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

const newUserFormValidator = [
	check('worker.firstName', 'Nombres es requerido').exists(),
	check('worker.lastName', 'Apellidos es requerido').exists(),
	check('worker.phone', 'Celular es requerido').exists()
]
//new costurera
router.post('/', [newUserFormValidator, verifyAuthJWTokenMiddleware], async (req, res) => {
	try {

		const {errors} = validationResult(req)

		if (!isEmpty(errors))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))

		const {worker} = req.body
		await newCostureraService(worker)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Costurera creada con exito'))
	} catch (e) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

//update costurera
router.put('/:id', [verifyAuthJWTokenMiddleware], async (req, res) => {
	try {
		const {id} = req.params
		const {worker} = req.body

		const workerDB = await loadWorkerByIdService(id)

		console.log(worker)
		if (isEmpty(workerDB?.[0]))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage('Costurera no encontrada'))

		await updateCostureraService(id, worker)

		return res.status(HTTP_STATUS_CODES.OK).json(getGenericMessage('Costurera actualizada con exito'))

	} catch (e) {
		console.log('Error: ', e)
		return res.send(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

export default router



