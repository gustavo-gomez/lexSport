import React from 'react'
import { render, screen } from '@testing-library/react'
import FloatingButton from '../../common/FloatingButton'

test('renders FloatingButton', async () => {
	const { getByText } = render(<FloatingButton/>)
	const element = screen.getByTestId('floating-button')
	expect(element).toBeInTheDocument()
})
