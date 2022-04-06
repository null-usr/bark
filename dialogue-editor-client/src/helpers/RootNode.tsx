import React, {
	memo,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	Connection,
	Edge,
	FlowElement,
	getConnectedEdges,
	Handle,
	isEdge,
	Position,
	removeElements,
	useUpdateNodeInternals,
	XYPosition,
} from 'react-flow-renderer'
import { v4 as uuidv4 } from 'uuid'
import { FlowContext } from '../contexts/FlowContext'

export class RootNode {
	readonly id: string = uuidv4()

	readonly type: string = 'root'

	readonly selectable: boolean = false

	readonly data: object = {
		label: 'ROOT',
		sources: [],
		targets: [],
	}

	position: XYPosition = { x: 100, y: 100 }
	sourcePosition = Position.Left
	targetPosition = Position.Right
}

// https://github.com/wbkd/react-flow/issues/1641
export default memo<{
	data: any
	id: string
	isConnectable: boolean
	sourcePosition: Position
	targetPosition: Position
}>(({ data, id, isConnectable, sourcePosition, targetPosition }) => {
	const nodeRef: any = useRef()
	const rFlow = useContext(FlowContext)
	const [targetArray, setTargetArray] = useState<any[]>(data.targets || [])
	const [sourceArray, setSourceArray] = useState<any[]>(
		data.sources || [`source-handle-1`]
	)
	const [dimensions, setDimensions] = useState({ width: 20, height: 20 })

	// when updating handles programmatically, this is needed
	const updateNodeInternals = useUpdateNodeInternals()

	// get node dimensions
	useLayoutEffect(() => {
		if (nodeRef.current) {
			setDimensions({
				width: nodeRef.current.offsetWidth + dimensions.width,
				height: nodeRef.current.offsetHeight + dimensions.height,
			})
		}
	}, [])

	useEffect(() => {
		updateNodeInternals(id)
	}, [sourceArray, targetArray])

	const add = (type: string) => {
		if (type === 'T' && targetArray.length < 10) {
			const tmp = `target-handle-${targetArray.length + 1}`
			setTargetArray([...targetArray, tmp])
		}
		if (type === 'S' && sourceArray.length < 10) {
			const tmp = `source-handle-${sourceArray.length + 1}`
			setSourceArray([...sourceArray, tmp])
		}
	}

	useEffect(() => {
		data.sources = sourceArray
	}, [sourceArray])

	useEffect(() => {
		data.targets = targetArray
	}, [targetArray])

	// need to make sure we also remove the edges from our flow
	const remove = (type: string, index: number) => {
		if (type === 'T') {
			let tmp = targetArray
			if (rFlow.elements) {
				const edges = rFlow.elements.filter((element) => {
					return (
						isEdge(element) &&
						element.target === data.id &&
						element.targetHandle === targetArray.at(index)
					)
				})
				if (edges) {
					rFlow.setElements((els: any) => removeElements(edges!, els))
				}
			}
			tmp = targetArray.splice(index, 1)
			setTargetArray(targetArray)
		}
		if (type === 'S') {
			let tmp = sourceArray
			if (rFlow.elements) {
				const edges = rFlow.elements.filter((element) => {
					return (
						isEdge(element) &&
						element.source === data.id &&
						element.sourceHandle === sourceArray.at(index)
					)
				})
				if (edges) {
					rFlow.setElements((els: any) => removeElements(edges!, els))
				}
			}
			tmp = sourceArray.splice(index, 1)
			setSourceArray(sourceArray)
		}
	}

	const positionHandle = (index: number) => {
		return 13 + 18 * index
	}

	const targetHandles = useMemo(
		() =>
			targetArray.map((x: any, i: number) => {
				const handleId = `target-handle-${i + 1}`
				return (
					<Handle
						key={handleId}
						type="target"
						position={Position.Left}
						id={handleId}
						style={{ top: positionHandle(i) }}
					/>
				)
			}),
		[targetArray, positionHandle]
	)

	const sourceHandles = useMemo(
		() =>
			sourceArray.map((x: any, i: number) => {
				const handleId = `source-handle-${i + 1}`
				return (
					<Handle
						key={handleId}
						type="source"
						position={Position.Right}
						id={handleId}
						style={{ top: positionHandle(i) }}
						onContextMenu={(event) => {
							event.preventDefault()
							remove('S', i)
						}}
					/>
				)
			}),
		[sourceArray, positionHandle]
	)

	return (
		<>
			<div
				style={{
					minHeight: `${
						(Math.max(targetArray.length, sourceArray.length) - 1) *
							18 +
						6
					}px`,
				}}
				ref={nodeRef}
			>
				{targetHandles}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<div style={{ flex: 1 }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							{/* <ButtonGroup
							orientation="vertical"
							aria-label="vertical outlined button group"
							size="small"
						> */}
							<button
								className="nodrag"
								key="targetMore"
								onClick={() => add('T')}
							>
								+
							</button>
							<button
								className="nodrag"
								key="targetLess"
								onClick={() => remove('T', -1)}
							>
								-
							</button>
							{/* <Button key="targetMore" onClick={() => add('T')}>
								+
							</Button> */}
						</div>
						{/* </ButtonGroup> */}
					</div>
					<div style={{ flex: 2 }}>
						<div style={{ fontWeight: 500, fontSize: 15 }}>
							{data.label}
						</div>
					</div>
					<div style={{ flex: 1 }}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
							}}
						>
							{/* <ButtonGroup
							orientation="vertical"
							aria-label="vertical outlined button group"
							size="small"
						> */}
							<button
								className="nodrag"
								key="sourceMore"
								onClick={() => add('S')}
							>
								+
							</button>
							<button
								className="nodrag"
								key="sourceLess"
								onClick={() => remove('S', -1)}
							>
								-
							</button>
							{/* <Button key="targetMore" onClick={() => add('T')}>
								+
							</Button> */}
						</div>
						{/* </ButtonGroup> */}
					</div>
				</div>
				{sourceHandles}
			</div>
		</>
	)
})
