import React, { useState } from 'react'
import '../scss/components/history.scss'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import IAFilters from '../common/IAFilters'
import { DATE_FORMAT, generateXlsAndDownload, getEndDateMillis, getStartDateMillis, ROLES } from '../utils/utils'
import { loadActivitiesAPI } from '../utils/apiUtils'
import { ACTIONS } from './NewHistory'
import { useSelector } from 'react-redux'
import { workers } from '../slices/workersSlice'
import moment from 'moment'

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
		key: 'price',
		align: 'right'
	},
]


const Payments = () => {

	const { workerList } = useSelector(workers)
	const [history, setHistory] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [dataSearch, setDataSearch] = useState({})

	const getTableBody = () => {
		let sum = 0
		let tableBody = map(history, ({ price, quantity, milliseconds, worker, product, action, productCode }, index) => {
			sum += +price
			return {
				date: moment(milliseconds).format(DATE_FORMAT.DATE_HYPHEN_PERU),
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
			price: <strong>{sum.toFixed(2)}</strong>
		})
		return tableBody
	}

	const searchHistory = async ({ startDate, endDate, workerId }) => {

		setIsLoading(true)
		setDataSearch({ startDate, endDate, workerId })
		const startDateMillis = getStartDateMillis(startDate)
		const endDateMillis = getEndDateMillis(endDate)

		const response = await loadActivitiesAPI(startDateMillis, endDateMillis, workerId)
		if (response?.data?.activities?.length > 0) {
			setHistory(response?.data?.activities)
		} else {
			setHistory([])
			setDataSearch({})
		}
		setIsLoading(false)
	}

	const onExport = async () => {
		const currentWorker = workerList.find(({ id }) => id === dataSearch?.workerId)
		const startDate = moment(dataSearch?.startDate).format(DATE_FORMAT.DATE_HYPHEN_PERU)
		const endDate = moment(dataSearch?.endDate).format(DATE_FORMAT.DATE_HYPHEN_PERU)
		let sum = 0
		setIsLoading(true)
		let jsonExcel = map(history, ({ price, quantity, date, worker, product, action, productCode }) => {
			sum += +price
			return {
				'Fecha': new Date(date).toLocaleDateString(),
				'Costurera': worker,
				'Código Producto': productCode,
				'Producto': product,
				'Acción': action === ACTIONS.FILL ? 'Relleno' : 'Confección',
				'Cantidad': quantity,
				'Precio': price,
			}
		})

		jsonExcel.push({
			'Cantidad': 'Total',
			'Precio': sum
		})
		await generateXlsAndDownload(
			jsonExcel,
			'Pagos',
			`${currentWorker?.firstName}_${currentWorker?.lastName}_${startDate}_${endDate}`)
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
				onExport={history?.length > 0 ? onExport : null}
				rolesToShow={[ROLES.COSTURERA]}
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
		</div>
	)
}

export default Payments
