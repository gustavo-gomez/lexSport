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
	const [startDate, setStartDate] = useState(new Date(moment().subtract(1, 'months')))
	const [endDate, setEndDate] = useState(new Date())
	const [history, setHistory] = useState([])
	const {width} = useDimension()

	// const {loggedUser} = useSelector(auth)
	// const {role_admin} = loggedUser
	// const isAdmin = role_admin === 1
	// const navigate = useNavigate()
	// const location = useLocation()

	const searchProductsDashboard = async () => {
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

	// const options = {
	// 	chart: {
	// 		title: 'Company Performance',
	// 		subtitle: 'Sales, Expenses, and Profit: 2014-2017',
	// 	}
	// }

	const options = {
		chart: {
			title: 'Cantidad elaborada por producto',
			// subtitle: "Based on most recent and previous census data",
		},
		hAxis: {
			title: "Total Population",
			minValue: 0,
		},
		vAxis: {
			title: "City",
		},
		bars: width >= 900 ? 'vertical' : 'horizontal',
	};

	return (
		<div
			className={'content-wrapper'}
			style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
		>
			<IAFilters
				startDate={startDate}
				endDate={endDate}
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				onSearch={searchProductsDashboard}
				isLoading={isLoading}
			/>
			{
				isLoading ?
					<IALoader/> :
					(
						history?.length > 1 ?
						<Chart
							chartType="Bar"
							data={history}
							width="100%"
							height="400px"
							// legendToggle
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
