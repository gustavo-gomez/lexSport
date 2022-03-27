import React, { useState } from 'react'
import '../scss/components/history.scss'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import { useNavigate } from 'react-router-dom'
import FloatingButton from '../common/FloatingButton'
import IAFilters from '../common/IAFilters'
import { DATE_FORMAT, getEndDateMillis, getStartDateMillis, ROLES } from '../utils/utils'
import { loadSchedulesAPI } from '../utils/apiUtils'
import moment from 'moment'

const tableHeader = [
	{
		label: 'Fecha',
		key: 'date'
	},
	{
		label: 'Trabajador',
		key: 'worker'
	},
	{
		label: 'Ingreso',
		key: 'enter'
	},
	{
		label: 'Refrigerio',
		key: 'break'
	},
	{
		label: 'Fin Refrigerio',
		key: 'endbreak'
	},
	{
		label: 'Salida',
		key: 'exit'
	},
	{
		label: 'Horas Trabajadas',
		key: 'workedHours'
	},
	{
		label: 'Horas Extras',
		key: 'extraHours'
	},
	{
		label: 'Horas Tardanza',
		key: 'lateHours'
	}
]

const Schedule = () => {

	const [history, setHistory] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const getTableBody = () => {
		return map(history, (historyItem, index) => {
			const {
				milliseconds,
				worker,
				enter,
				break: refrigerio,
				endbreak,
				exit,
				workedHours,
				extraHours,
				lateHours
			} = historyItem
			return {
				date: moment(milliseconds).format(DATE_FORMAT.DATE_HYPHEN_PERU),
				enter: enter && moment(enter).format(DATE_FORMAT.TIME_PERIOD_24),
				break: refrigerio && moment(refrigerio).format(DATE_FORMAT.TIME_PERIOD_24),
				endbreak: endbreak && moment(endbreak).format(DATE_FORMAT.TIME_PERIOD_24),
				exit: exit && moment(exit).format(DATE_FORMAT.TIME_PERIOD_24),
				worker,
				workedHours: workedHours === '00:00' ? '-' : workedHours,
				extraHours: extraHours === '00:00' ? '-' : extraHours,
				lateHours: lateHours === '00:00' ? '-' : lateHours,
			}
		})
	}

	const searchHistory = async ({ startDate, endDate, workerId }) => {
		setIsLoading(true)
		const startDateMillis = getStartDateMillis(startDate)
		const endDateMillis = getEndDateMillis(endDate)

		const response = await loadSchedulesAPI(startDateMillis, endDateMillis, workerId)
		if (response?.data?.schedules?.length > 0) {
			setHistory(response?.data?.schedules)
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
			<span className={'section-title'}>Historial de Horarios</span>
			<IAFilters
				onSearch={searchHistory}
				isLoading={isLoading}
				showWorkerFilter
				rolesToShow={[ROLES.JORNAL, ROLES.COSTURERA]}
				isWorkerRequired={false}
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
				onClick={() => navigate('/horarios/nuevo')}
			/>
		</div>
	)
}

export default Schedule
