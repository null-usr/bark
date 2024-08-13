import React from 'react'
import Button from '@/components/Button/Button'
import { ButtonRow } from '../styles'

const AddFields: React.FC<{
	addField: (name: string) => void
	hasCustomVars: boolean
}> = ({ addField, hasCustomVars }) => {
	return (
		<ButtonRow>
			<Button type="secondary" onClick={() => addField('string')}>
				String
			</Button>
			<Button type="secondary" onClick={() => addField('text')}>
				Text
			</Button>
			<Button type="secondary" onClick={() => addField('bool')}>
				Boolean
			</Button>
			<Button type="secondary" onClick={() => addField('number')}>
				Number
			</Button>
			<Button type="secondary" onClick={() => addField('data')}>
				data
			</Button>
			<Button
				type="secondary"
				disabled={!hasCustomVars}
				onClick={() => addField('custom')}
			>
				custom
			</Button>
		</ButtonRow>
	)
}

export default AddFields
