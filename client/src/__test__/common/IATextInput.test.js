import React from 'react'
import { render, screen } from '@testing-library/react'
import IATextInput from '../../common/IATextInput'

const commonProps = {
	id: 'test123',
	label: 'NameTest',
	name: 'name',
	value: 'value test',
	testId: 'inputtest'
}

test('render TextInput', async () => {
	const { getByText, debug, getByRole } = render(
		<IATextInput
			{...commonProps}
			helperText={'required field'}
		/>
	)
	const name = getByText(commonProps.label)
	const helperText = getByText('required field')
	const value = screen.getByRole('textbox')

	expect(value).toHaveValue(commonProps.value)
	expect(name).toBeInTheDocument()
	expect(helperText).toBeInTheDocument()
})
