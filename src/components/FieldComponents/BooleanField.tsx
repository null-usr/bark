import React, { useEffect, useState } from 'react'
import Button from '@/components/Button/Button'
import { FieldContainer } from './styles'

export const BooleanField: React.FC<{
	k: string
	v: boolean
	index: number
	updateKey(index: number, k: string): void
	updateValue(index: number, v: any): void
	del?(k: string): void
	error?: boolean
}> = ({ k, v, index, error, updateKey, updateValue, del }) => {
	const [key, setKey] = useState(k)
	const [value, setValue] = useState(v)

	// Forward changing values from the node details
	useEffect(() => {
		setValue(v)
	}, [v])
	return (
		<FieldContainer error={error}>
			<input
				type="text"
				value={key}
				onChange={(e) => setKey(e.target.value)}
				onSubmit={() => updateKey(index, key)}
			/>
			:
			<input
				type="checkbox"
				checked={value}
				onChange={(e) => {
					setValue(e.target.checked)
					updateValue(index, e.target.checked)
				}}
			/>
			{k !== key && (
				<Button onClick={() => updateKey(index, key)}>
					Rename Key
				</Button>
			)}
			<Button danger onClick={del ? () => del(k) : undefined}>
				Delete
			</Button>
		</FieldContainer>
	)
}
