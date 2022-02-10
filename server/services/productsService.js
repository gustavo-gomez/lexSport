import {camelize} from "../utils/utils";
import {loadAllProducts} from "../repositories/productsRepository";


export const loadAllProductsService = async user => {
	const usersDB = await loadAllProducts(user)
	return camelize(usersDB)
}
