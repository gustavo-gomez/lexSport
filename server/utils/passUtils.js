import jwt from 'jsonwebtoken'
import {getGenericMessage, HTTP_STATUS_CODES} from "./utils.js";
import sha256 from 'crypto-js/sha256.js';
import hmacSHA512 from 'crypto-js/hmac-sha512.js';
import Base64 from 'crypto-js/enc-base64.js';
import {loadWorkerByIdService} from "../services/workerService";

const PRIVATE_KEY = 'keylexsportsystem'

export const hashPassword = password => {
	return Base64.stringify(hmacSHA512(sha256(password), PRIVATE_KEY))
}

export const verifyPassword = (savedPassword, attemptedPassword) => {
	return savedPassword === hashPassword(attemptedPassword)
}

export const createAuthJWToken = async worker => {
	return await jwt.sign(worker, PRIVATE_KEY)
}

export const verifyAuthJWTokenMiddleware = async (req, res, next) => {
	const bearerHeader = req.headers.authorization || ''
	const [, bearerToken] = bearerHeader.split(' ')
	try {
		req.tokenDecoded = jwt.verify(bearerToken, PRIVATE_KEY)
		//validate is admin
		const worker = await loadWorkerByIdService(req.tokenDecoded?.id)
		if (worker?.roleAdmin === 0) {
			res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json(getGenericMessage('You are not authorized to access this resource'))
		}
		next()
	} catch (e) {
		return res.status(HTTP_STATUS_CODES.FORBIDDEN).json(getGenericMessage('Not authorized'))
	}
}
