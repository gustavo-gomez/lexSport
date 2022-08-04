import {Router} from 'express'
import {loadWorkerByUSerService} from "../services/workerService.js";
import {
	getSuccessResponse,
	getGenericMessage,
	HTTP_STATUS_CODES,
	validationErrorsToArray
} from "../utils/utils.js";
import { createAuthJWToken, hashPassword, verifyPassword } from '../utils/passUtils.js'
import omit from "lodash/omit.js";
import {check, validationResult} from 'express-validator'
import isEmpty from "lodash/isEmpty";

const router = Router()

const loginValidator = [
	check('user', 'Usuario es requerido').exists(),
	check('password', 'Contraseña es requerida').exists()
]
router.post('/login', [loginValidator], async (req, res) => {
	try {
		const {errors} = validationResult(req)

		if (!isEmpty(errors))
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))

		const {user, password} = req.body
		const userDB = await loadWorkerByUSerService(user)

		const loginError = getGenericMessage('Usuario o contraseña incorrectos')

		if (userDB?.length === 0)
			return res.status(HTTP_STATUS_CODES.FORBIDDEN).send(loginError)

		const {password: dbUserPassword} = userDB[0]
		if (dbUserPassword === hashPassword(password)) {
			const cleanedWorker = omit(userDB[0], ['password'])
			cleanedWorker.permissions = cleanedWorker?.permission?.split(",")

			const worker = {...cleanedWorker, token: await createAuthJWToken(cleanedWorker)}
			console.log('return: ', worker)
			return res.json(getSuccessResponse({worker}))
		} else {
			return res.status(HTTP_STATUS_CODES.FORBIDDEN).json(loginError)
		}
	} catch (e) {
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

export default router
