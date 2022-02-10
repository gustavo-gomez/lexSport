import {
	loadAllCostureras,
	loadWorkerById,
	loadWorkerByUser, newCosturera, updateCosturera
} from "../repositories/workerRepository.js";
import omit from "lodash/omit.js";
import {camelize} from "../utils/utils";

export const loadWorkerByUSerService = async user => {
	const usersDB = await loadWorkerByUser(user)
	return camelize(usersDB)
}

export const loadWorkerByIdService = async id => {
	const usersDB = await loadWorkerById(id)
	return camelize(usersDB) || []
}

export const loadAllCosturerasService = async () => {
	const usersDB = await loadAllCostureras()
	return camelize(usersDB)
}

export const newCostureraService = async worker => {
	await newCosturera(worker)
}

export const updateCostureraService = async (id, worker) => {
	await updateCosturera(id, worker)
}
