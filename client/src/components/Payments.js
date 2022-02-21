import React, { useState } from 'react'
import '../scss/components/history.scss'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import { useNavigate } from 'react-router-dom'
import FloatingButton from '../common/FloatingButton'
import IAFilters from '../common/IAFilters'
import { getEndDateMillis, getStartDateMillis } from '../utils/utils'
import { loadActivitiesAPI } from '../utils/apiUtils'
import { ACTIONS } from './NewHistory'

const tableHeader = [
	{
		label: 'Fecha',
		key: 'date'
	},
	{
		label: 'Costurera',
		key: 'worker'
	},
	{
		label: 'Código Producto',
		key: 'productCode'
	},
	{
		label: 'Producto',
		key: 'product'
	},
	{
		label: 'Acción',
		key: 'action'
	},
	{
		label: 'Cantidad',
		key: 'quantity'
	},
	{
		label: 'Precio',
		key: 'price'
	},
]


const History = () => {

	const [history, setHistory] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const getTableBody = () => {
		let sum = 0
		let tableBody = map(history, ({ price, quantity, date, worker, product, action, productCode }, index) => {
			sum += +price
			return {
				date: new Date(date).toLocaleDateString(),
				worker,
				productCode,
				product,
				action: action === ACTIONS.FILL ?
					<span style={{ color: 'green' }}>Relleno</span> :
					<span style={{ color: '#ffa111' }}>Confección</span>,
				quantity,
				price,
			}
		})
		tableBody.push({
			quantity: <strong>Total</strong>,
			price: <strong>{sum}</strong>
		})
		return tableBody
	}

	const searchHistory = async ({ startDate, endDate, workerId }) => {

		setIsLoading(true)
		const startDateMillis = getStartDateMillis(startDate)
		const endDateMillis = getEndDateMillis(endDate)

		const response = await loadActivitiesAPI(startDateMillis, endDateMillis, workerId)
		if (response?.data?.activities?.length > 0) {
			setHistory(response?.data?.activities)
		} else {
			setHistory([])
		}
		setIsLoading(false)
	}


	return (
		<div
			className={'content-wrapper'}
			style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
		>
			<span className={'section-title'}>Pagos</span>
			<IAFilters
				onSearch={searchHistory}
				isLoading={isLoading}
				showWorkerFilter
			/>
			<div
				className="history-table"
			>
				{
					isLoading ?
						<IALoader/> :
						(
							history?.length > 0 ?
								<CommonTable
									tableHeader={tableHeader}
									body={getTableBody()}
									onClickRow={() => null}
								/> :
								<IALoader type={LOTTIE_TYPE.EMPTY}/>
						)
				}
			</div>
			<FloatingButton
				onClick={() => navigate('/historial/nuevo')}
			/>
		</div>
	)
}

export default History
