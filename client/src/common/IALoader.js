import React from 'react';
import Lottie from 'lottie-react';
import loader from '../images/lottie/loader.json'
import '../scss/components/ialoader.scss'

const IALoader = () => {

	return (
		<div
			className="ia-loader-container"
		>

			<Lottie
				className={'ia-loader'}
				animationData={loader}
				loop
				autoplay
			/>
		</div>
	)
}

export default IALoader
