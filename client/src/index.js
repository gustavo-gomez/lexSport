import React from 'react'
import ReactDOM from 'react-dom'
import './scss/index.scss'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { store } from './store'
import { Provider } from 'react-redux'
import { Provider as AlertProvider } from 'react-alert'
import  { ALERT_OPTIONS } from './common/IAAlertTemplate'
// import IAAlertTemplate, { ALERT_OPTIONS } from './common/IAAlertTemplate'
import AlertTemplate from 'react-alert-template-basic'

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<AlertProvider template={AlertTemplate} {...ALERT_OPTIONS}>
				<App/>
			</AlertProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
)

reportWebVitals()
