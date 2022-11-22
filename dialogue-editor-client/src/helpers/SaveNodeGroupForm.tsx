import React, { Component, useState } from 'react'

const SaveNodeGroupForm: React.FC<{
	submit: (name: string, color: string) => void
}> = ({ submit }) => {
	const [name, setName] = useState('')
	const [color, setColor] = useState('#000')

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				// @ts-ignore
				submit(e.target[0].value, e.target[1].value)
			}}
		>
			<input
				name="group_name"
				value={name}
				onChange={(e) => {
					setName(e.target.value)
				}}
			/>
			<input
				type="color"
				defaultValue={color}
				onChange={(e) => setColor(e.target.value)}
				className="nodrag"
			/>
			<button type="submit">Save</button>
		</form>
	)
}

export default SaveNodeGroupForm
