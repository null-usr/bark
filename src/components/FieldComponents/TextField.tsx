/*
    Object would just be a react-flow handle to another node
*/

import React, { useEffect, useState } from 'react'
import { FlexColumn, FlexRow } from '../styles'

export const TextField: React.FC<{
	k: string
	v: string
	index: number
	updateKey(index: number, k: string): void
	updateValue(index: number, v: any): void
	del(k: string): void
	error?: boolean
}> = ({ k, v, index, error, updateKey, updateValue, del }) => {
	const [key, setKey] = useState(k)
	const [value, setValue] = useState(v)

	// Forward changing values from the node details
	useEffect(() => {
		setValue(v)
	}, [v])
	return (
		<FlexColumn
			style={{
				minHeight: 64,
				width: '100%',
			}}
		>
			<FlexRow>
				<input
					type="text"
					style={{ flex: 1 }}
					value={key}
					onChange={(e) => setKey(e.target.value)}
					// onSubmit={() => updateKey(index, key)}
				/>
				{k !== key && (
					<>
						<button className="btn-primary" onClick={() => updateKey(index, key)}>
							Update Key
						</button>
						<button className="btn-secondary" onClick={() => setKey(k)}>
							Cancel
						</button>
					</>
				)}
				<button className="btn-alert" onClick={() => del(k)}>
					Delete
				</button>
			</FlexRow>
			<textarea
				value={v}
				onChange={(event) => {
					updateValue(index, event.target.value)
				}}
				style={{ resize: 'vertical' }}
			/>
		</FlexColumn>
	)
}
