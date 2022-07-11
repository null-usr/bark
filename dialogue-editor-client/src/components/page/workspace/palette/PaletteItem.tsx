import React from 'react'

const PaletteItem: React.FC<{
	classname: string
	name: string
	type: string
	fields?: any[]
}> = ({ classname, name, type, fields, ...props }) => {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		const data = JSON.stringify({
			nodeType: type,
			fields,
		})
		event.dataTransfer.setData('application/reactflow', data)
		event.dataTransfer.effectAllowed = 'move'
	}

	return (
		<div
			draggable="true"
			className={classname}
			onDragStart={(event) => onDragStart(event)}
		>
			{name}
		</div>
	)
}

export default PaletteItem
