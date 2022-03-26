import { Router } from 'express'
import { getGenericMessage, getSuccessResponse, HTTP_STATUS_CODES, validationErrorsToArray } from '../utils/utils.js'
import { verifyAuthJWTokenIsAdmin } from '../utils/passUtils.js'
import { loadActivitiesQuantitiesService } from '../services/activityService'
import { loadAllProductsService } from '../services/productsService'
import { orderBy } from 'lodash'
import { check, param, query, validationResult } from 'express-validator'
import isEmpty from 'lodash/isEmpty'

const router = Router()

// get activities
router.get('/products', [verifyAuthJWTokenIsAdmin], async (req, res) => {
	try {
		const { startDate, endDate } = req.query

		const activitiesDB = await loadActivitiesQuantitiesService(new Date(+startDate), new Date(+endDate))
		const products = await loadAllProductsService({})

		const history = [
			[
				'Producto',
				'Cantidad',
			]
		]

		const activities = orderBy(activitiesDB, 'date', 'desc').map(activity => {
			const product = products.find(product => product.id === activity.productId)

			return [
				`${product.code}`,
				// `${product.code} - ${product.name}`,
				+(activity?.quantity),
			]
		})
		history.push(...activities)

		return res.json(getSuccessResponse({ history }))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

const newActivityValidator = [
	param('id', 'Trabahador es requerido').not().isEmpty(),
	query('startDate', 'fecha inicio es requerida').not().isEmpty(),
]

// get activities
router.get('/workers/:id', [newActivityValidator, verifyAuthJWTokenIsAdmin], async (req, res) => {
	try {
		const { errors } = validationResult(req)

		if (!isEmpty(errors)) {
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))
		}

		const { startDate, endDate } = req.query
		const {id} = req.params


		const activitiesDB = await loadActivitiesQuantitiesService(new Date(+startDate), new Date(+endDate), id)
		const products = await loadAllProductsService({})

		const history = [
			[
				'Producto',
				'Cantidad',
			]
		]

		const activities = orderBy(activitiesDB, 'date', 'desc').map(activity => {
			const product = products.find(product => product.id === activity.productId)

			return [
				`${product.code}`,
				// `${product.code} - ${product.name}`,
				+(activity?.quantity),
			]
		})
		history.push(...activities)

		return res.json(getSuccessResponse({ history }))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

export default router



