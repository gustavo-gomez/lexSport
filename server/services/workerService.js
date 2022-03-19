import {
	deleteCosturera,
	loadWorkersByRole,
	loadWorkerById,
	loadWorkerByUser,
	newWorker,
	updateCosturera
} from '../repositories/workerRepository.js'
import { camelize } from '../utils/utils'

export const loadWorkerByUSerService = async user => {
	const usersDB = await loadWorkerByUser(user)
	return camelize(usersDB)
}

export const loadWorkerByIdService = async id => {
	const usersDB = await loadWorkerById(id)
	return camelize(usersDB) || []
}

export const loadWorkersByRoleService = async (roles = []) => {
	const usersDB = await loadWorkersByRole(roles)
	return camelize(usersDB)
}

export const newWorkerService = async worker => {
	await newWorker(worker)
}

export const updateCostureraService = async (id, worker) => {
	await updateCosturera(id, worker)
}

export const deleteCostureraService = async (id) => {
	await deleteCosturera(id)
}
