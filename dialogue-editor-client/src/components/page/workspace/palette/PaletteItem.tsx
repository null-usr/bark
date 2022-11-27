import React from 'react'
import useStore, { RFState, types } from '../../../../store/store'

const PaletteItem: React.FC<{
	className: string
	name: string
	type: string
	fields?: any[]
	nodes?: any[]
	edges?: any[]
	modable?: boolean
}> = ({
	className,
	name,
	type,
	fields,
	nodes,
	edges,
	modable = false,
	...props
}) => {
	const dispatch = useStore((store: RFState) => store.dispatch)
	const displayName = name.replace('@workspace/', '')

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
			{displayName}
			{modable && (
				<>
					<button
						onClick={() => {
							dispatch({
								type: types.customizeSchema,
								data: { mode: 'customize', schema: name },
							})
						}}
					>
						E
					</button>
					<button
						onClick={() =>
							dispatch({
								type:
									displayName === name
										? types.deleteCustomNode
										: types.deleteCustomWorkspaceNode,
								data: name,
							})
						}
					>
						X
					</button>
				</>
			)}
		</div>
	)
}

export default PaletteItem
