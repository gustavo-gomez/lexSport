import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import authentication from "./routes/authentication"
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics();


const PORT = process.env.PORT || 9000
const PROD = process.env.NODE_ENV === 'production'

const app = express()
if (PROD) {
	app.use(express.static(__dirname + '/client'))
}
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html')
})

app.get('/metrics', async (_req, res) => {
	try {
		res.set('Content-Type', register.contentType);
		console.log("metricssssssssss")
		res.end(await register.metrics());
	} catch (err) {
		res.status(500).end(err);
	}
});


app.use('/', authentication)


if (PROD) {
	// Handles any requests that don't match the ones above
	app.get('*', (req, res) => {
		res.sendFile(__dirname + '/client/index.html')
	})
}

app.listen(PORT, () => {
	console.log(`Server listening : ${PORT}`)
})


