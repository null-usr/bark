import React from 'react'

const PaletteItem: React.FC<{
	className: string
	name: string
	type: string
	fields?: any[]
	nodes?: any[]
	edges?: any[]
}> = ({ className, name, type, fields, nodes, edges, ...props }) => {
	const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		const data = JSON.stringify({
			name,
			type,
			fields,
			nodes,
			edges,
			className,
		})
		event.dataTransfer.setData('application/reactflow', data)
		event.dataTransfer.effectAllowed = 'move'
	}

	return (
		<div
			draggable="true"
			className="node react-flow__node-default"
			onDragStart={(event) => onDragStart(event)}
		>
			{name}
		</div>
	)
}

export default PaletteItem
