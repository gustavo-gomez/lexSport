import React, { useEffect, useState } from 'react'
import '../scss/components/sidebar.scss'
import '../scss/components/newworkers.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts, products } from '../slices/productsSlice'
import map from 'lodash/map'
import CommonTable from '../common/CommonTable'
import IALoader from '../common/IALoader'
import { useDimension } from '../utils/useDimension'
import NewProduct from './NewProduct'
import IAModal from '../common/IAModal'
import FloatingButton from '../common/FloatingButton'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search';
import { MOBILE_WIDTH, scrollToTop } from '../utils/utils'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { deleteProductAPI } from '../utils/apiUtils'
import { useAlert } from 'react-alert'
import IATextInput from "../common/IATextInput";

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
    label: 'P. Alto',
    key: 'makingPriceHigh'
  },
  {
    label: 'P. Bajo',
    key: 'makingPriceLow'
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
  const { activeProductList, isLoading } = useSelector(products)
  const [ productEdit, setProductEdit ] = useState(null)
  const [ showNewProductForm, setShowNewProductForm ] = useState(false)
  const [ openDeleteModal, setOpenDeleteModal ] = useState(false)
  const [ search, setSearch ] = useState("")
  const [ idToDelete, setIdToDelete ] = useState(null)
  const { width } = useDimension()
  const dispatch = useDispatch()
  const alert = useAlert()

  useEffect(() => {
    dispatch(getAllProducts())
  }, [])

  const getTableBody = () => {
    const filteredList = search?.trim()?.length === 0 ?
      activeProductList :
      activeProductList.filter(({ name, code }) => name.toLowerCase().includes(search.toLowerCase()) || code.toLowerCase().includes(search.toLowerCase()))
    return map(filteredList, ({ id, code, name, makingPriceLow, makingPriceHigh, fillPrice }, index) => {

      return {
        code,
        name,
        makingPriceLow,
        makingPriceHigh,
        fillPrice,
        actions: (
          <div
            style={{ display: 'flex' }}
          >
            <EditIcon
              className={'icon'}
              color='primary'
              onClick={() => handleEdit(index)}
              style={{ marginRight: '10px' }}
            />
            <DeleteIcon
              className={'icon'}
              color="error"
              onClick={() => {
                setIdToDelete(id)
                setOpenDeleteModal(true)
              }}
            />
          </div>
        )
      }
    })
  }

  const handleEdit = (index) => {
    setProductEdit(activeProductList?.[index])
    setShowNewProductForm(true)
    scrollToTop()
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

  const deleteProduct = async () => {
    const response = await deleteProductAPI(idToDelete)

    if (response?.isError)
      alert.error(response?.responseMessage)
    else
      alert.success('Se ha eliminado el producto')

    setOpenDeleteModal(false)
    setIdToDelete(null)
    dispatch(getAllProducts())
  }

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
        <span className={'section-title'}>Lista de Productos</span>
        <IATextInput
          label={'Buscar'}
          name={'search'}
          value={search}
          sx={{ width: '80%', marginBottom: '20px' }}
          placeholder={'Buscar por nombre o código'}
          InputProps={{
            startAdornment: (
              <SearchIcon
                className={'icon'}
                color='primary'
                style={{ marginRight: '10px' }}
              />
            )
          }}
          onChangeText={(e) => setSearch(e.target.value)}
        />
        {
          activeProductList?.length > 0 &&
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
          onClick={() => {
            setShowNewProductForm(true)
            scrollToTop()
          }}
        />
      }
      <IAModal
        isOpen={openDeleteModal}
        child={(
          <div
            className={'modal-delete card'}
          >
            <p>Esta seguro que desea eliminar el producto ?</p>
            <div className={'buttons'}>
              <Button
                onClick={() => {
                  setOpenDeleteModal(false)
                  setIdToDelete(null)
                }}
                variant="outlined"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <LoadingButton
                onClick={deleteProduct}
                variant="outlined"
                color={'error'}
                loading={isLoading}
              >
                Eliminar
              </LoadingButton>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default Products
