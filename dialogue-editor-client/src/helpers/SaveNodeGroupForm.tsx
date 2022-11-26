import React, { Component, useState } from 'react'

const SaveNodeGroupForm: React.FC<{
	name?: string | null
	color?: string
	submit: (name: string, color: string) => void
}> = ({ name, color, submit }) => {
	const [formName, setName] = useState(name || '')
	const [formColor, setColor] = useState(color || '#000')

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
				value={formName}
				onChange={(e) => {
					setName(e.target.value)
				}}
			/>
			<input
				type="color"
				defaultValue={formColor}
				onChange={(e) => setColor(e.target.value)}
				className="nodrag"
			/>
			<button type="submit">Save</button>
		</form>
	)
}

export default SaveNodeGroupForm
