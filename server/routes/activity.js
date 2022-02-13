import { Router } from 'express'
import { getGenericMessage, HTTP_STATUS_CODES, validationErrorsToArray } from '../utils/utils.js'
import { verifyAuthJWTokenMiddleware } from '../utils/passUtils.js'
import { check, validationResult } from 'express-validator'
import isEmpty from 'lodash/isEmpty'
import { newActivityService } from '../services/activityService'

const router = Router()

const newActivityValidator = [
	check('activities', 'Actividad es requerida').not().isEmpty(),
]
// insert activities
router.post('/', [newActivityValidator, verifyAuthJWTokenMiddleware], async (req, res) => {
	try {
		const { errors } = validationResult(req)

		if (!isEmpty(errors)) {
			return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json(getGenericMessage(validationErrorsToArray(errors)))
		}
		const { activities, dateMillis } = req.body

		await newActivityService(activities, dateMillis)

		return res.status(HTTP_STATUS_CODES.CREATED).json(getGenericMessage('Actividades creadas con éxito'))

	} catch ( e ) {
		console.log('Error: ', e)
		return res.json(getGenericMessage())
	}
})

export default router



