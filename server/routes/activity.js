import { Router } from 'express'
import { getGenericMessage, getSuccessResponse, HTTP_STATUS_CODES, validationErrorsToArray } from '../utils/utils.js'
import { verifyAuthJWToken, verifyAuthJWTokenIsAdmin } from '../utils/passUtils.js'
import { check, validationResult } from 'express-validator'
import isEmpty from 'lodash/isEmpty'
import { getActivitiesService, newActivityService } from '../services/activityService'
import { loadAllCosturerasService } from '../services/workerService'
import { loadAllProductsService } from '../services/productsService'
import { orderBy } from 'lodash'

const router = Router()

// get activities
router.get('/', [verifyAuthJWToken], async (req, res) => {
	try {
		const { startDate, endDate, workerId} = req.query
		const {roleAdmin} = req.tokenDecoded
		console.log('date: ', new Date(+startDate))
		console.log('datee: ', new Date(+endDate))

		const activitiesDB = await getActivitiesService(workerId, new Date(+startDate), new Date(+endDate))
		const workers = await loadAllCosturerasService()
		const products = await loadAllProductsService()

		const activities = orderBy(activitiesDB, 'date', 'desc').map(activity => {
			const worker = workers.find(worker => worker.id === activity.workerId)
			const product = products.find(product => product.id === activity.productId)
			return {
				id: activity?.id,
				price: roleAdmin ? activity?.price : undefined,
				action: activity?.action,
				quantity: activity?.quantity,
				date: activity?.date,
				worker: `${worker?.lastName}, ${worker?.firstName}`,
				product: product?.name,
				productCode: product?.code,
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

		await newActivityService(activities, new Date(dateMillis))

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Actividades creadas con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

export default router



