import { Router } from 'express'
import {
	getGenericMessage,
	getSuccessResponse,
	HTTP_STATUS_CODES,
	ROLES,
	validationErrorsToArray
} from '../utils/utils.js'
import { verifyAuthJWToken } from '../utils/passUtils.js'
import { check, validationResult } from 'express-validator'
import isEmpty from 'lodash/isEmpty'
import {
	deleteActivityService,
	editActivityService,
	getActivitiesService,
	newActivityService
} from '../services/activityService'
import { loadAllCosturerasService } from '../services/workerService'
import { loadAllProductsService } from '../services/productsService'
import { orderBy } from 'lodash'

const router = Router()

// get activities
router.get('/', [verifyAuthJWToken], async (req, res) => {
	try {
		const { startDate, endDate, workerId } = req.query
		const { id, role } = req.tokenDecoded
		const isAdmin = role === ROLES.ADMIN
		const idToFilter = isAdmin ? null : id
		const activitiesDB = await getActivitiesService(workerId, new Date(+startDate), new Date(+endDate), idToFilter)
		const workers = await loadAllCosturerasService()
		const products = await loadAllProductsService({onlyFillPrice: false})

		const activities = orderBy(activitiesDB, 'date', 'desc').map(activity => {
			const worker = workers.find(worker => worker.id === activity.workerId)
			const product = products.find(product => product.id === activity.productId)
			return {
				id: activity?.id,
				price: isAdmin ? activity?.price : undefined,
				action: activity?.action,
				quantity: activity?.quantity,
				date: activity?.date,
				milliseconds: new Date(activity?.date).getTime(),
				worker: `${worker?.lastName}, ${worker?.firstName}`,
				product: product?.name,
				productCode: product?.code,
				workerId: activity?.workerId,
				productId: activity?.productId
			}
		})

		return res.json(getSuccessResponse({ activities }))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

const newActivityValidator = [
	check('activities', 'Actividad es requerida').not().isEmpty(),
]
// insert activities
router.post('/', [newActivityValidator, verifyAuthJWToken], async (req, res) => {
	try {
		const { errors } = validationResult(req)

		if (!isEmpty(errors)) {
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))
		}
		const { activities, dateMillis } = req.body
		const {id} = req.tokenDecoded

		await newActivityService(activities, new Date(dateMillis), id)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Actividades creadas con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

// const newActivityValidator = [
// 	check('activities', 'Actividad es requerida').not().isEmpty(),
// ]
// delete activity
router.delete('/:id', [verifyAuthJWToken], async (req, res) => {
	try {
		// const { errors } = validationResult(req)
		//
		// if (!isEmpty(errors)) {
		// 	return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))
		// }
		const { id } = req.params

		await deleteActivityService(id)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Actividad eliminada con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

const editActivityValidator = [
	check('activity', 'Actividad es requerida').not().isEmpty(),
]
// edit activity
router.put('/', [editActivityValidator, verifyAuthJWToken], async (req, res) => {
	try {
		const { errors } = validationResult(req)

		if (!isEmpty(errors)) {
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))
		}
		const { activity } = req.body
		await editActivityService(activity)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Actividad editada con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

export default router



