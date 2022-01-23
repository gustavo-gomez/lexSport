import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

const PRIVATE_KEY = 'keylexsportsystem'

export const hashPassword = password => {
	return Base64.stringify(hmacSHA512(sha256(password), PRIVATE_KEY))
}