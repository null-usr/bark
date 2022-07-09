import React from 'react'
import { FieldContainer } from './styles'

export const BooleanField: React.FC<{
	k: string
	v: boolean
	index: number
	updateField(index: number, k: string, v: any): void
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
				type="checkbox"
				checked={v}
				onChange={(e) => updateField(index, k, e.target.checked)}
			/>
			<button onClick={del ? () => del(k) : undefined}>Delete</button>
		</FieldContainer>
	)
}
