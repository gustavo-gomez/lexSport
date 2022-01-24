import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import authentication from "./routes/authentication";

const PORT = process.env.PORT || 9000
const PROD = process.env.NODE_ENV === 'production'

const app = express();
if (PROD){
	app.use(express.static(__dirname + '/client'))
}
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html')
})

app.use('/', authentication)
// app.use('/timezones', timezones)
// app.use('/users', users)



if (PROD) {
	// Handles any requests that don't match the ones above
	app.get('*', (req, res) => {
		res.sendFile(__dirname + '/client/index.html')
	})
}

app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`)
})


