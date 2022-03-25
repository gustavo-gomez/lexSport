import { camelize } from '../utils/utils'
import {
	deleteProduct,
	loadAllProducts,
	loadProductById,
	newProduct,
	updateProduct
} from '../repositories/productsRepository'


export const loadProductByIdService = async id => {
	const usersDB = await loadProductById(id)
	return camelize(usersDB)
}

export const loadAllProductsService = async ({onlyFillPrice = false}) => {
	const usersDB = await loadAllProducts({onlyFillPrice})
	return camelize(usersDB)
}

export const newProductService = async product => {
	const usersDB = await newProduct(product)
	return camelize(usersDB)
}

export const updateProductService = async (id, product) => {
	const usersDB = await updateProduct(id, product)
	return camelize(usersDB)
}

export const deleteProductService = async (id) => {
	await deleteProduct(id)
}
