import {
	deleteCosturera,
	loadWorkersByRole,
	loadWorkerById,
	loadWorkerByUser,
	newWorker,
	updateCosturera
} from '../repositories/workerRepository.js'
import { camelize } from '../utils/utils'
import { map, omit } from 'lodash'
import { hashPassword } from '../utils/passUtils'

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
	return camelize(map(usersDB, user => omit(user, 'password')))
}

export const newWorkerService = async worker => {
	const hashPass = hashPassword(worker.password)
	const workerToSave = { ...omit(worker, 'password'), password: hashPass }
	await newWorker(workerToSave)
}

export const updateCostureraService = async (id, worker) => {
	await updateCosturera(id, worker)
}

export const deleteCostureraService = async (id) => {
	await deleteCosturera(id)
}
