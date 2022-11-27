import React, { Component, useState } from 'react'

const SaveNodeGroupForm: React.FC<{
	name?: string | null
	color?: string
	saveToEditor?: boolean
	submit: (name: string, color: string, saveEditor: boolean) => void
}> = ({ name, color, saveToEditor, submit }) => {
	const [formName, setName] = useState(name || '')
	const [formColor, setColor] = useState(color || '#000')
	const [saveEditor, setSaveEditor] = useState(
		saveToEditor === undefined ? false : saveToEditor
	)

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				// @ts-ignore
				submit(formName, formColor, saveEditor)
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
			Save To Editor
			<input
				type="checkbox"
				defaultChecked={false}
				onChange={(e) => setSaveEditor(e.target.checked)}
			/>
			<button type="submit">Save</button>
		</form>
	)
}

export default SaveNodeGroupForm
