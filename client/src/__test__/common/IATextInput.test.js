import React from 'react'
import { render, screen } from '@testing-library/react'
import IATextInput from '../../common/IATextInput'

const commonProps = {
	id: 'test123',
	label: 'Name',
	name: 'name',
	value: 'value test',
	// isRequired: true,
	// onChangeText: {onChange},
	// helperText: 'required field',
}

test('render TextInput', async () => {
	const { getByText, debug, getByRole } = render(
		<IATextInput
			{...commonProps}
		/>
	)
	// const name = getByText(commonProps.label)
	const value = screen.getByRole('textbox')
	expect(screen.getByTestId('test123')).toHaveValue(commonProps.value);
	// debug()

	// expect(name).toBeInTheDocument()
	// expect(value).toHaveValue(commonProps.value+'qwe')
})
