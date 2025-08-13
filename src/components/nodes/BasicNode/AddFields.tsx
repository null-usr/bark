import React from 'react'
import { ButtonRow } from '../styles'

const AddFields: React.FC<{
	addField: (name: string) => void
	hasCustomVars: boolean
}> = ({ addField, hasCustomVars }) => {
	return (
		<ButtonRow>
			<button
				className="btn-secondary"
				onClick={() => addField('string')}
			>
				String
			</button>
			<button className="btn-secondary" onClick={() => addField('text')}>
				Text
			</button>
			<button className="btn-secondary" onClick={() => addField('bool')}>
				Boolean
			</button>
			<button
				className="btn-secondary"
				onClick={() => addField('number')}
			>
				Number
			</button>
			<button className="btn-secondary" onClick={() => addField('data')}>
				data
			</button>
			<button
				className="btn-secondary"
				disabled={!hasCustomVars}
				onClick={() => addField('custom')}
			>
				custom
			</button>
		</ButtonRow>
	)
}

export default AddFields
