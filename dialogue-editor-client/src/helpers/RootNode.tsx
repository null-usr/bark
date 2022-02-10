import React, {
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	Handle,
	Position,
	useUpdateNodeInternals,
	XYPosition,
} from 'react-flow-renderer'

// https://github.com/wbkd/react-flow/issues/1641
export const IncNode: React.FC<{
	isConnectable: boolean
	sourcePosition: Position
	targetPosition: Position
	data: any
	id: string
}> = ({ isConnectable, sourcePosition, targetPosition, data, id }) => {
	const nodeRef: any = useRef()
	const [targetArray, setTargetArray] = useState<any[]>([])
	const [sourceArray, setSourceArray] = useState<any[]>([])
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
			const tmp = targetArray.length + 1
			setTargetArray([...targetArray, tmp])
		}
		if (type === 'S' && sourceArray.length < 10) {
			const tmp = sourceArray.length + 1
			setSourceArray([...sourceArray, tmp])
		}
	}
	const remove = (type: string) => {
		if (type === 'T') {
			let tmp = [...targetArray]
			tmp = targetArray.slice(0, -1)
			setTargetArray(tmp)
		}
		if (type === 'S') {
			let tmp = [...sourceArray]
			tmp = sourceArray.slice(0, -1)
			setSourceArray(tmp)
		}
	}

	// designed to order 4 handles
	// const positionHandle = (index: number) => {
	// 	if (index === 1 || index === 2) {
	// 		return (dimensions.height / 3) * index
	// 	} else if (index === 3) {
	// 		return 0
	// 	}
	// 	return dimensions.height
	// }

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
								onClick={() => remove('T')}
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
								onClick={() => remove('S')}
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
}

class RootNode {
	readonly id: string = 'root'

	readonly type: string = 'input'

	readonly selectable: boolean = false

	readonly data: object = {
		label: (
			<IncNode
				isConnectable
				sourcePosition={Position.Left}
				targetPosition={Position.Right}
				data={{ label: <p>ROOT</p> }}
				id={this.id}
			/>
		),
	}

	position: XYPosition = { x: 100, y: 100 }
}

export default RootNode
