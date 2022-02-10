import {Router} from 'express'
import {getGenericMessage, getSuccessResponse} from "../utils/utils.js"
import {verifyAuthJWTokenMiddleware} from "../utils/passUtils.js"
import {loadAllProductsService} from "../services/productsService";

const router = Router()

//get all products
router.get('/', [verifyAuthJWTokenMiddleware], async (req, res) => {
	try {

		const products = await loadAllProductsService()

		return res.json(getSuccessResponse({products}))
	} catch (e) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

export default router



