import React, { useState } from 'react'
import '../scss/components/history.scss'
import { useDispatch } from 'react-redux'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader, { LOTTIE_TYPE } from '../common/IALoader'
import { useDimension } from '../utils/useDimension'
import { useNavigate } from 'react-router-dom'
import FloatingButton from '../common/FloatingButton'

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

	const [productEdit, setProductEdit] = useState(null)
	const [showNewProductForm, setShowNewProductForm] = useState(false)
	const { width } = useDimension()
	const dispatch = useDispatch()
	const navigate = useNavigate()


	const getTableBody = () => {
		return map(history, ({ price, quantity, date, worker, product, productCode }, index) => {

			return {
				date: new Date(date).toLocaleDateString(),
				worker,
				productCode,
				product,
				quantity,
				price
			}
		})
	}

	if (isLoading) {
		return (
			<IALoader/>
		)
	}

	return (
		<div
			className={'content-wrapper'}
			style={{ justifyContent: 'center' }}
		>
			<div
				className="history-table"
			>
				<h2>Historial de registros</h2>
				{
					history?.length > 0 ?
						<CommonTable
							tableHeader={tableHeader}
							body={getTableBody()}
							onClickRow={() => null}
						/> :
						<IALoader type={LOTTIE_TYPE.EMPTY}/>
				}
			</div>
			{
				!showNewProductForm &&
				<FloatingButton
					onClick={() => navigate('/historial/nuevo')}
				/>
			}
		</div>
	)
}

export default History
