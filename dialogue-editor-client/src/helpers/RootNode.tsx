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
	const [targetArray, setTargetArray] = useState<any>([])
	const [sourceArray, setSourceArray] = useState<any>([])
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

	const addTarget = (type: string) => {
		if (type === 'T' && targetArray.length < 4) {
			const tmp = targetArray.length + 1
			setTargetArray([...targetArray, tmp])
		}
	}
	const addSource = (type: string) => {
		if (type === 'T' && sourceArray.length < 4) {
			const tmp = sourceArray.length + 1
			setTargetArray([...sourceArray, tmp])
		}
	}

	const positionHandle = (index: number) => {
		if (index === 1 || index === 2) {
			return (dimensions.height / 3) * index
		} else if (index === 3) {
			return 0
		}
		return dimensions.height
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
						style={{ top: positionHandle(i + 1) }}
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
						style={{ top: positionHandle(i + 1) }}
					/>
				)
			}),
		[sourceArray, positionHandle]
	)

	return (
		<>
			<div ref={nodeRef}>
				{targetHandles}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-around',
						alignItems: 'center',
					}}
				>
					<div style={{ flex: 1 }}>
						<div>
							{/* <ButtonGroup
							orientation="vertical"
							aria-label="vertical outlined button group"
							size="small"
						> */}
							<button
								key="targetMore"
								onClick={() => addTarget('T')}
							>
								+
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
						<div>
							{/* <ButtonGroup
							orientation="vertical"
							aria-label="vertical outlined button group"
							size="small"
						> */}
							<button
								key="sourceMore"
								onClick={() => addSource('T')}
							>
								+
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
				data={{ label: <p>djkojfpwd</p> }}
				id={this.id}
			/>
		),
	}

	position: XYPosition = { x: 100, y: 100 }
}

export default RootNode
