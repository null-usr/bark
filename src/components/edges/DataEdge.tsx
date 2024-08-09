import React, { useState, FC, useEffect } from 'react'
import {
	BaseEdge,
	EdgeLabelRenderer,
	EdgeProps,
	getSmoothStepPath,
	useReactFlow,
} from 'reactflow'

import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { splitEdge } from '@/helpers/edgeHelpers'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'
import IconButton from '../Button/IconButton'
import CloseIcon from '../Icons/Close'
import NotepadIcon from '../Icons/Notepad'

const foreignObjectSize = 40

export const DataEdge: FC<EdgeProps> = ({
	id,
	source,
	target,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	sourceHandleId,
	targetHandleId,
	data,
}) => {
	const [edgePath, centerX, centerY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})

	const { onConnect, addNode } = useStore()
	const dispatch = useStore((store) => store.dispatch)

	const [name, setName] = useState(data.name)
	const [hovered, setHovered] = useState(false)

	const updateName = (newName: string) => {
		setName(newName)
	}

	useEffect(() => {
		data.name = name
	}, [name])

	return (
		<>
			{/* look into interactionWidth for easier to select edges */}
			{/* https://reactflow.dev/docs/api/edges/edge-options/#options */}
			{/* <path
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEnd}
				fillRule="evenodd"
			/> */}
			<BaseEdge id={id} path={edgePath} />
			<EdgeLabelRenderer>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: 4,
						position: 'absolute',
						transform: `translate(-50%, -50%) 
							translate(${centerX}px,${centerY}px)`,
						pointerEvents: 'all',
						backgroundColor: hovered ? 'gray' : 'white',
						border: '1px solid grey',
						padding: 4,
						borderRadius: 5,
						fontSize: 12,
						fontWeight: 700,
						zIndex: 1001, // don't want edges on top of this
					}}
					className="nopan nodrag"
					onDrop={(e) => {
						e.preventDefault()
						e.stopPropagation()
						// console.log(e)

						const nodeData = e.dataTransfer.getData(
							'application/reactflow'
						)

						const paletteItem = JSON.parse(nodeData)

						const position = { x: centerX, y: centerY }

						const { newNodes, newEdges } = decodeSchema(
							position,
							paletteItem
						)

						newNodes.forEach((n) => addNode(n))
						newEdges.forEach((ed) => onConnect(ed))

						const insertedEdges = splitEdge(
							{
								id,
								source,
								target,
								sourceHandle: sourceHandleId,
								targetHandle: targetHandleId,
								data,
							},
							newNodes[0]
						)

						// if our incoming node is a source we discard
						// the first part of the split
						if (paletteItem.type !== 'source') {
							onConnect(insertedEdges[0])
						}
						onConnect(insertedEdges[1])
						dispatch({
							type: types.deleteEdge,
							data: id,
						})
					}}
					onMouseOver={(e) => {
						setHovered(true)
					}}
					onMouseLeave={(e) => {
						setHovered(false)
					}}
					onFocus={() => {}}
				>
					<IconButton
						background="black"
						radius="3px"
						color="white"
						Icon={NotepadIcon}
						onClick={(event) =>
							dispatch({ type: types.setEdge, data: id })
						}
					/>
					{/* {sourceHandleId} */}
					<IconButton
						background="black"
						radius="3px"
						color="white"
						Icon={CloseIcon}
						onClick={(event) =>
							dispatch({ type: types.deleteEdge, data: id })
						}
					/>
				</div>
			</EdgeLabelRenderer>
		</>
	)
}

export default DataEdge
