import React, {
	createRef,
	forwardRef,
	useImperativeHandle,
	useState,
	FC,
	useContext,
	useEffect,
} from 'react'
import {
	applyEdgeChanges,
	BaseEdge,
	Connection,
	Edge,
	EdgeLabelRenderer,
	EdgeProps,
	getBezierPath,
	getMarkerEnd,
	getSmoothStepPath,
	useReactFlow,
} from 'reactflow'

import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { splitEdge } from '@/helpers/edgeHelpers'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'

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
	markerEnd,
}) => {
	const [edgePath, centerX, centerY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})

	const reactFlowInstance = useReactFlow()

	const { onConnect, addNode } = useStore()
	const dispatch = useStore((store) => store.dispatch)

	const [name, setName] = useState(data.name || 'placeholder')
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
						backgroundColor: hovered ? 'blue' : 'white',
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
						onConnect(insertedEdges[0])
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
					<div>
						<button
							className="edgebutton nopan"
							onClick={(event) =>
								dispatch({ type: types.setEdge, data: id })
							}
						>
							o
						</button>
					</div>
					{/* {sourceHandleId} */}
					<div>
						<button
							className="edgebutton nopan"
							onClick={(event) =>
								dispatch({ type: types.deleteEdge, data: id })
							}
						>
							×
						</button>
					</div>
				</div>
			</EdgeLabelRenderer>
		</>
	)
}

export default DataEdge
