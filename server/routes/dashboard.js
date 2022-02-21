import { Router } from 'express'
import { getGenericMessage, getSuccessResponse } from '../utils/utils.js'
import { verifyAuthJWTokenMiddleware } from '../utils/passUtils.js'
import { loadActivitiesQuantitiesService } from '../services/activityService'
import { loadAllProductsService } from '../services/productsService'
import { orderBy } from 'lodash'

const router = Router()

// get activities
router.get('/products', [verifyAuthJWTokenMiddleware], async (req, res) => {
	try {
		const { startDate, endDate } = req.query
		console.log(startDate, endDate)
		console.log('DATES: ' + new Date(+startDate))
		console.log('DATES: ' + new Date(+endDate))


		const activitiesDB = await loadActivitiesQuantitiesService(new Date(+startDate), new Date(+endDate))
		const products = await loadAllProductsService()

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
		return res.json(getGenericMessage())
	}
})

export default router



