import React, { useState } from 'react'
import { Chart } from 'react-google-charts'
import IAFilters from '../common/IAFilters'
import { getEndDateMillis, getStartDateMillis } from '../utils/utils'
import { loadProductsDashboardAPI } from '../utils/apiUtils'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import moment from 'moment'
import { useDimension } from '../utils/useDimension'

const DashboardProducts = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [history, setHistory] = useState([])
	const { width } = useDimension()

	const searchProductsDashboard = async ({ startDate, endDate }) => {
		setIsLoading(true)
		const startDateMillis = getStartDateMillis(startDate)
		const endDateMillis = getEndDateMillis(endDate)

		const response = await loadProductsDashboardAPI(startDateMillis, endDateMillis)
		if (response?.data?.history?.length > 0) {
			setHistory(response?.data?.history)
		} else {
			setHistory([])
		}
		setIsLoading(false)
	}

	console.log('history', history)

	const options = {
		chart: {
			title: 'Cantidad elaborada por producto',
			// subtitle: "Based on most recent and previous census data",
		},
		hAxis: {
			title: 'Total Population',
			minValue: 0,
		},
		vAxis: {
			title: 'City',
		},
		// bars: width >= 900 ? 'vertical' : 'horizontal',
		bars: 'horizontal',
	}

	return (
		<div
			className={'content-wrapper'}
			style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
		>
			<span className={'section-title'}>Grafico de Productos</span>
			<IAFilters
				onSearch={searchProductsDashboard}
				isLoading={isLoading}
				defaultStartDate={new Date(moment().subtract(1, 'months'))}
			/>
			{
				isLoading ?
					<IALoader/> :
					(
						history?.length > 1 ?
							<Chart
								chartType="Bar"
								data={history}
								width="96%"
								className={'card'}
								style={{ padding: '10px' }}
								height={width >= 900 ? '800px' : '370px'}
								legendToggle
								// title={'Population of Largest U.S. Cities'}
								// chartArea={{ width: '50%' }}
								options={options}
							/> :
							<IALoader type={LOTTIE_TYPE.EMPTY}/>
					)
			}
		</div>
	)
}

export default DashboardProducts
