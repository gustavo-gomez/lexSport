import React from 'react'
import Lottie from 'lottie-react'
import loader from '../images/lottie/loader.json'
import empty from '../images/lottie/empty.json'
import '../scss/components/ialoader.scss'

export const LOTTIE_TYPE = {
	EMPTY: {
		source: empty,
		text: 'No hay registros',
		height: 150,
	},
	LOADING: {
		source: loader,
		text: 'Cargando...',
		height: 250,
	}
}

const IALoader = ({ type }) => {

	return (
		<div
			className="ia-loader-container"
			style={type.source === empty ? { position: 'relative' } : { position: 'absolute', zIndex: 9999 }}
		>
			<Lottie
				className={type.source === empty ? 'ia-lottie': 'ia-loader'}
				animationData={type.source}
				loop
				autoplay
			/>
			<p>{type.text}</p>
		</div>
	)
}

export default IALoader

IALoader.defaultProps = {
	type: LOTTIE_TYPE.LOADING,
}
