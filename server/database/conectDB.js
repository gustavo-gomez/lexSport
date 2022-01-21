import mysql from 'mysql2/promise'

const DB_CONNECT_URL = process.env.LEX_SPORT_DB_CONNECT_URL || 'localhost'
const DB_USERNAME = process.env.LEX_SPORT_DB_USERNAME || 'root'
const DB_PASSWORD = process.env.LEX_SPORT_DB_PASSWORD || 'root'
const DB_PORT = process.env.LEX_SPORT_DB_PORT || '3306'


export const getConnection = async () => {
	return await mysql.createConnection({
		host: DB_CONNECT_URL,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: 'timezoneproject',
		port: DB_PORT
	})
}

