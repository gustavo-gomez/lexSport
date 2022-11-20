import { Router } from 'express'
import { getGenericMessage, getSuccessResponse, HTTP_STATUS_CODES } from '../utils/utils.js'
import { check } from 'express-validator'
import { newActivityService } from '../services/activityService'

const router = Router()

const loginValidator = [
	check('user', 'Usuario es requerido').exists(),
	check('password', 'Contraseña es requerida').exists()
]
router.post('/login', async (req, res) => {
	try {
		console.log('ok')
		await newActivityService()
		return res.json(getSuccessResponse({}))
	} catch ( e ) {
		return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json(getGenericMessage())
	}
})

export default router
