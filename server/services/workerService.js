import {
	loadWorkerByUser
} from "../repositories/workerRepository.js";
import omit from "lodash/omit.js";

export const loadWorkerByUSerService = async user => {
	const usersDB = await loadWorkerByUser(user)
	return usersDB
}
