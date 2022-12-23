/*
    Object would just be a react-flow handle to another node
*/

import React, { useState } from 'react'
import { FieldContainer } from './styles'

export const StringField: React.FC<{
	k: string
	v: string
	index: number
	updateField(index: number, k: string, v: string): void
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
				type="text"
				value={value}
				onChange={(e) => setValue(e.target.value)}
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
