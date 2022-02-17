import React, {useEffect, useState} from 'react'
import '../scss/components/sidebar.scss'
import {useDispatch, useSelector} from 'react-redux'
import {getAllProducts, products} from "../slices/productsSlice";
import map from "lodash/map";
import CommonTable from "../common/CommonTable";
import IALoader from "../common/IALoader";
import {useDimension} from "../utils/useDimension";
import NewProduct from "./NewProduct";
import IAModal from "../common/IAModal";
import FloatingButton from "../common/FloatingButton";
import EditIcon from "@mui/icons-material/Edit";
import { MOBILE_WIDTH } from '../utils/utils'

const tableHeader = [
	{
		label: 'Código',
		key: 'code'
	},
	{
		label: 'Producto',
		key: 'name'
	},
	{
		label: 'Precio',
		key: 'makingPriceLow'
	},
	{
		label: 'Precio2',
		key: 'makingPriceHigh'
	},
	{
		label: 'Precio Llenado',
		key: 'fillPrice'
	},
	{
		label: '',
		key: 'actions'
	},
]


const Products = () => {
	const {productList, isLoading} = useSelector(products)
	const [productEdit, setProductEdit] = useState(null)
	const [showNewProductForm, setShowNewProductForm] = useState(false)
	const {width} = useDimension()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(getAllProducts())
	}, [])

	const getTableBody = () => {
		return map(productList, ({code, name, makingPriceLow, makingPriceHigh, fillPrice}, index) => {

			return {
				code,
				name,
				makingPriceLow,
				makingPriceHigh,
				fillPrice,
				actions: (
					<>
						<EditIcon
							className={'icon'}
							color='primary'
							onClick={() => handleEdit(index)}
						/>
					</>
				)
			}
		})
	}

	const handleEdit = (index) => {
		setProductEdit(productList?.[index])
		setShowNewProductForm(true)
		window.scrollTo(0, 0)
	}

	const cancelEdit = () => {
		setProductEdit(null)
		setShowNewProductForm(false)
	}

	const newProductForm = (
		<NewProduct
			hideSection={() => cancelEdit()}
			productEdit={productEdit}
		/>
	)

	if (isLoading) {
		return (
			<IALoader/>
		)
	}

	return (
		<div
			className={'content-wrapper'}
		>
			<div className='users-table'>
				<h2>Lista de Productos</h2>
				{
					productList?.length > 0 &&
					<CommonTable
						tableHeader={tableHeader}
						body={getTableBody()}
						onClickRow={() => null}
					/>
				}
			</div>
			{
				width >= MOBILE_WIDTH ?
					(
						showNewProductForm &&
						<div
							className={'new-worker-section'}
						>
							{newProductForm}
						</div>
					) :
					<IAModal
						isOpen={showNewProductForm}
						child={newProductForm}
						handleClose={cancelEdit}
					/>
			}
			{
				!showNewProductForm &&
				<FloatingButton
					onClick={() => setShowNewProductForm(true)}
				/>
			}
		</div>
	);
}

export default Products
