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
	Connection,
	Edge,
	EdgeProps,
	getBezierPath,
	getEdgeCenter,
	getMarkerEnd,
	getSmoothStepPath,
	useReactFlow,
} from 'react-flow-renderer'

import '../style.css'
import { FlowContext } from '../../contexts/FlowContext'
import useStore, { RFState, types } from '../../store/store'

// export const VariableEdge = forwardRef<
// 	{ getEdgeName(): string },
// 	{ n?: string }
// >(({ n }, ref) => {
// 	const [name, setName] = useState(n || 'placeholder')

// 	const updateName = (newName: string) => {
// 		setName(newName)
// 	}

// 	// The component instance will be extended with whatever you return from the callback passed
// 	// as the second argument
// 	useImperativeHandle(ref, () => ({
// 		getEdgeName() {
// 			return name
// 		},
// 	}))

// 	return (
// 		<Container>
// 			{/* <button onClick={addField}>Add Text Field</button> */}
// 			<input
// 				className="nodrag"
// 				value={name}
// 				onChange={(e) => updateName(e.target.value)}
// 			/>
// 		</Container>
// 	)
// })

const foreignObjectSize = 40

export const DataEdgeType: FC<EdgeProps> = ({
	id,
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
	const edgePath = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	})
	const [centerX, centerY] = getEdgeCenter({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
	})

	// shared flow context
	const reactFlowInstance = useReactFlow()
	const { getEdges } = useReactFlow()
	const dispatch = useStore((store: RFState) => store.dispatch)

	const [name, setName] = useState(data.name || 'placeholder')

	const updateName = (newName: string) => {
		setName(newName)
	}

	useEffect(() => {
		data.name = name
	}, [name])

	return (
		<>
			{/* <path
				id={id}
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEnd}
			/> */}

			<path
				className="react-flow__edge-path-selector"
				d={edgePath}
				markerEnd={markerEnd}
				fillRule="evenodd"
			/>
			<path
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEnd}
				fillRule="evenodd"
			/>
			<foreignObject
				width={foreignObjectSize}
				height={foreignObjectSize}
				x={centerX - foreignObjectSize / 2}
				y={centerY - foreignObjectSize / 2 + 50}
				className="edgebutton-foreignobject"
				requiredExtensions="http://www.w3.org/1999/xhtml"
			>
				<div>
					<button
						className="edgebutton"
						onClick={(event) =>
							dispatch({ type: types.setEdge, data: id })
						}
					>
						o
					</button>
				</div>
			</foreignObject>
			<foreignObject
				width={200}
				height={100}
				x={centerX - 100}
				y={centerY}
			>
				<input
					className="nodrag"
					value={data.name}
					onChange={(e) => {
						updateName(e.target.value)
					}}
				/>
				{sourceHandleId}
				{targetHandleId}
			</foreignObject>
			<foreignObject
				width={foreignObjectSize}
				height={foreignObjectSize}
				x={centerX - foreignObjectSize / 2}
				y={centerY - foreignObjectSize / 2 - 12}
				className="edgebutton-foreignobject"
				requiredExtensions="http://www.w3.org/1999/xhtml"
			>
				<div>
					<button
						className="edgebutton"
						onClick={(event) =>
							dispatch({ type: types.deleteEdge, data: id })
						}
					>
						×
					</button>
				</div>
			</foreignObject>
		</>
	)
}

// similar to BasicNode, need to get fields from it
class DataEdge implements Connection {
	id: string
	type = 'data'
	source: string
	target: string
	sourceHandle: string | null
	targetHandle: string | null

	name: string
	edgeData: any
	data: any = {}

	constructor(
		source: string,
		target: string,
		sourceHandle: string | null,
		targetHandle: string | null,
		name?: string
	) {
		this.id = `${source}-${sourceHandle}-${target}`

		if (name) {
			this.name = name
		} else {
			this.name = this.id
		}

		this.source = source
		this.sourceHandle = sourceHandle
		this.target = target
		this.targetHandle = targetHandle

		this.edgeData = createRef()
		this._set_data()
	}

	_set_data() {
		this.data = {
			name: this.name,
			fields: [],
		}
	}
}

export default DataEdge
