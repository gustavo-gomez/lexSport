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
//
// test('TextInput: show error message', async () => {
// 	const { getByText } = render(ge
// 		<IATextInput
// 			{...commonProps}
// 			isRequired={true}
// 			error={true}
// 			helperText={'required field'}
// 		/>
// 	)
// 	const asterisk = getByText('*')
// 	const required = getByText('required field')
//
// 	expect(asterisk).toBeInTheDocument()
// 	expect(required).toBeInTheDocument()
// })
