import {Router} from 'express'
import {getGenericMessage, getSuccessResponse, HTTP_STATUS_CODES, validationErrorsToArray} from "../utils/utils.js"
import { verifyAuthJWToken, verifyAuthJWTokenIsAdmin } from '../utils/passUtils.js'
import {
	loadAllProductsService,
	loadProductByIdService,
	newProductService,
	updateProductService
} from "../services/productsService";
import {check, validationResult} from "express-validator";
import isEmpty from "lodash/isEmpty";

const router = Router()

//get all products
router.get('/', [verifyAuthJWToken], async (req, res) => {
	try {

		const products = await loadAllProductsService()

		return res.json(getSuccessResponse({products}))
	} catch (e) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

const newProductFormValidator = [
	check('product.code', 'Código es requerido').exists(),
	check('product.name', 'Nombre es requerido').exists(),
	check('product.makingPriceLow', 'Precio alto es requerido').exists(),
	check('product.makingPriceHigh', 'Precio bajo es requerido').exists(),
]
// insert product
router.post('/', [newProductFormValidator, verifyAuthJWTokenIsAdmin], async (req, res) => {
	try {
		const {errors} = validationResult(req)

		if (!isEmpty(errors))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))

		const {product} = req.body
		await newProductService(product)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Producto creado con éxito'))

	} catch (e) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

const updateProductFormValidator = [
	check('product.code', 'Código es requerido').exists(),
	check('product.name', 'Nombre es requerido').exists(),
	check('product.makingPriceLow', 'Precio alto es requerido').exists(),
	check('product.makingPriceHigh', 'Precio bajo es requerido').exists(),
]
// update product
router.put('/:id', [updateProductFormValidator, verifyAuthJWTokenIsAdmin], async (req, res) => {
	try {
		const {errors} = validationResult(req)

		if (!isEmpty(errors))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))

		const {id} = req.params
		const {product} = req.body

		const products = await loadProductByIdService(id)

		if (isEmpty(products?.[0]))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage('Producto no encontrada'))
		console.log('products: ', products)
		await updateProductService(id, product)

		return res.status(HTTP_STATUS_CODES.OK).json(getGenericMessage('Producto actualizado con éxito'))

	} catch (e) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

export default router



