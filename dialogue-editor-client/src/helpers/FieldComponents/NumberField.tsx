import React from 'react'
import { FieldContainer } from './styles'

export const NumberField: React.FC<{
	k: string
	v: string
	index: number
	updateField(index: number, k: string, v: string): void
	del?(k: string): void
}> = ({ k, v, index, updateField, del }) => {
	return (
		<FieldContainer>
			<input
				type="text"
				value={k}
				onChange={(e) => updateField(index, e.target.value, v)}
			/>
			:
			<input
				type="number"
				value={v}
				onChange={(e) => updateField(index, k, e.target.value)}
			/>
			<button onClick={del ? () => del(k) : undefined}>Delete</button>
		</FieldContainer>
	)
}
