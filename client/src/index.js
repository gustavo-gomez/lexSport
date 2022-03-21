import React from 'react'
import ReactDOM from 'react-dom'
import './scss/index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { store } from './store'
import { Provider } from 'react-redux'
import AlertTemplate from 'react-alert-template-basic'
import { transitions, positions, Provider as AlertProvider } from 'react-alert'

const options = {
	// you can also just use 'bottom center'
	position: positions.BOTTOM_CENTER,
	timeout: 5000,
	offset: '30px',
	// you can also just use 'scale'
	transition: transitions.SCALE
}

ReactDOM.render(
	<React.StrictMode>
		<AlertProvider template={AlertTemplate} {...options}>
			<Provider store={store}>
				<App/>
			</Provider>
		</AlertProvider>
	</React.StrictMode>,
	document.getElementById('root')
)

reportWebVitals()
