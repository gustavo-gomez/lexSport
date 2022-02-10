import React from 'react'
import Modal from '@mui/material/Modal';
import PropTypes from "prop-types";
import '../scss/components/iamodal.scss'

const IAModal = ({isOpen, handleClose, child}) => {

	return (
		<Modal
			open={isOpen}
			onClose={handleClose}
			className={'ia-modal-container'}
		>
			<>
				{child}
			</>
		</Modal>
	)
}

export default IAModal

IAModal.defaultProps = {
	isOpen: false,
	handleClose: () => {
	},
	child: null
}

IAModal.prototype = {
	isOpen: PropTypes.bool,
	handleClose: PropTypes.func,
	child: PropTypes.element.isRequired
}
