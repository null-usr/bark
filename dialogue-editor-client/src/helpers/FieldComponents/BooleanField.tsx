import React, { useState } from 'react'
import { FieldContainer } from './styles'

export const BooleanField: React.FC<{
	k: string
	v: boolean
	index: number
	updateField(index: number, k: string, v: any): void
	del?(k: string): void
}> = ({ k, v, index, updateField, del }) => {
	const [key, setKey] = useState(k)
	const [value, setValue] = useState(v)
	return (
		<FieldContainer>
			<input
				type="text"
				value={key}
				onChange={(e) => setKey(e.target.value)}
			/>
			:
			<input
				type="checkbox"
				checked={value}
				onChange={(e) => setValue(e.target.checked)}
			/>
			{(k !== key || v !== value) && (
				<button onClick={() => updateField(index, key, value)}>
					Save
				</button>
			)}
			<button onClick={del ? () => del(k) : undefined}>Delete</button>
		</FieldContainer>
	)
}
