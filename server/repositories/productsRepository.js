import {getConnection} from "../database/conectDB.js";
import {uuid} from "uuidv4";

export const loadProductById = async id => {
	const connection = await getConnection()
	const sql = `
      select *
      from products
      where id = ?
	`
	const [rows] = await connection.execute(sql, [id])
	await connection.end()
	return rows || []
}

export const loadAllProducts = async () => {
	const connection = await getConnection()
	const sql = `
      select *
      from products
	`
	const [rows] = await connection.execute(sql)
	await connection.end()
	return rows || []
}


export const newProduct = async ({code, name, makingPriceLow, makingPriceHigh, fillPrice = 0.00}) => {
	const connection = await getConnection()
	const sql = `
      INSERT INTO products(id, code, name, making_price_low, making_price_high, fill_price)
      VALUES (?, ?, ?, ?, ?, ?)
	`
	const [rows] = await connection.execute(sql, [uuid(), code, name, makingPriceLow, makingPriceHigh, fillPrice])
	await connection.end()
	return rows || []
}

export const updateProduct = async (id, {name, makingPriceLow, makingPriceHigh, fillPrice}) => {
	const connection = await getConnection()
	const sql = `
      UPDATE products
      SET name              = ?,
          making_price_low  = ?,
          making_price_high = ?,
          fill_price        = ?
      WHERE id = ?

	`
	const [rows] = await connection.execute(sql, [name, makingPriceLow, makingPriceHigh, fillPrice, id])
	await connection.end()
	return rows || []
}


