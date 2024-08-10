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
	Handle,
	isEdge,
	NodeProps,
	Position,
	useReactFlow,
	useUpdateNodeInternals,
	XYPosition,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import { FlowContext } from '@/contexts/FlowContext'
import useStore from '@/store/store'
import { Node } from '@/helpers/theme'
import { Field } from '@/helpers/types'
import { getOutgoingEdges } from '@/helpers/edgeHelpers'
import { types } from '@/store/reducer'

import { ReactComponent as ChevronDownIcon } from '@/assets/icons/chevron_down.svg'
import { ReactComponent as ChevronUpIcon } from '@/assets/icons/chevron_up.svg'
import { ObjectField } from '../FieldComponents/ObjectField'
import { FlexColumn } from '../styles'
import PlusCircleIcon from '../Icons/PlusCircle'
import IconButton from '../Button/IconButton'

export class SourceNode {
	readonly id: string = uuidv4()

	readonly type: string = 'source'

	readonly selectable: boolean = false

	readonly data: object = {
		label: 'ROOT',
		type: 'source',
		sources: [],
		// targets: [],
	}

	position: XYPosition = { x: 100, y: 100 }
	sourcePosition = Position.Left
	// targetPosition = Position.Right
}

// https://github.com/wbkd/react-flow/issues/1641
export default ({
	dragging,
	selected,
	data,
	id,
}: NodeProps<{
	id: string
	name: string
	fields: Field[]
}>) => {
	const {
		nodes,
		edges,
		workspace,
		mode,
		updateNodeColor,
		updateNodeName,
		deleteNode,
	} = useStore()
	const updateHandles = useStore((state) => state.updateNodeHandles)
	const dispatch = useStore((store) => store.dispatch)

	// when updating handles programmatically, this is needed
	const updateNodeInternals = useUpdateNodeInternals()

	const nodeRef: any = useRef()
	const reactFlowInstance = useReactFlow()

	const [dimensions, setDimensions] = useState({ width: 20, height: 20 })

	const [errors, setErrors] = useState<{ [key: number]: boolean }>({})
	const [expanded, setExpanded] = useState(true)
	const [name, setName] = useState<string>(data.name)

	const [sourceArray, setSourceArray] = useState<any[]>(
		data.fields.filter((f) => f.type === 'data').map((f) => f.value) || []
	)
	const [fields, setFields] = useState<Field[]>(data.fields || [])
	const [count, setCount] = useState(fields.length)

	const addHandle = (key: string) => {
		if (sourceArray.length < 10) {
			setSourceArray([...sourceArray, key])
		}
	}

	const addField = (type: string) => {
		let value
		if (type === 'data') {
			// We create a handle with a key of key:{count}
			value = `value ${count}`
			addHandle(`key:${count}`)
			setFields([...data.fields, { key: `key:${count}`, value, type }])
			data.fields = [...data.fields, { key: `key:${count}`, value, type }]
			setCount(count + 1)
			return
		}

		setFields([...data.fields, { key: `key: ${count}`, value, type }])
		data.fields = [...data.fields, { key: `key: ${count}`, value, type }]

		setCount(count + 1)
	}

	const deleteField = (fieldID: string) => {
		setFields(fields.filter((el) => el.key !== fieldID))
		data.fields = data.fields.filter((el) => el.key !== fieldID)
	}

	const updateDataFieldKey = (index: number, k: string) => {
		const indices: number[] = []
		data.fields.forEach((f, i) => f.key === k && indices.push(i))
		if (indices.length > 0) {
			const ers = {}
			// @ts-ignore
			ers[index] = true
			indices.forEach((i) => {
				// @ts-ignore
				ers[i] = true
			})

			setErrors(ers)
			return
		}

		// update the corresponding edge
		const outgoing = getOutgoingEdges(id, edges)

		const editEdge = outgoing.filter(
			(e) => e.sourceHandle === fields[index].key
		)[0]

		if (editEdge) {
			editEdge.sourceHandle = k
			editEdge.data = { ...editEdge.data }

			// new is type connection:
			// source, target, sourceHandle targetHandle
			// in our case we only modify the sourceHandle
			dispatch({
				type: types.editEdgeHandle,
				data: {
					old: editEdge,
					new: {
						source: editEdge.source,
						target: editEdge.target,
						sourceHandle: k,
						targetHandle: editEdge.targetHandle,
					},
				},
			})
		}

		// need to force a re-render by updating node itnerals, aka
		// by editing the sourcehandles array

		const newHandles = sourceArray.filter((e) => e !== fields[index].key)
		newHandles.push(k)

		setErrors({})
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		f[index] = item
		setFields(f)
		setSourceArray(newHandles)

		data.fields[index] = { ...data.fields[index], key: k }
	}

	// when updating handles programmatically, this is needed
	// have to update immediately or last handle isn't registered for some reason
	// const updateNodeInternals = useUpdateNodeInternals()
	// updateNodeInternals(id)

	const positionHandle = (index: number) => {
		return 13 + 18 * index
	}

	useEffect(() => {
		updateNodeInternals(id)
	}, [sourceArray])

	return (
		<>
			{/* {dragging && 
			
			
			} */}

			<Node
				dragging={dragging}
				selected={selected}
				style={{ padding: 8 }}
			>
				<FlexColumn>
					<div
						style={{
							display: 'flex',
							gap: 16,
							justifyContent: 'space-around',
							alignItems: 'center',
						}}
					>
						<div style={{ flex: 2 }}>
							{/* TODO: this should change the node's ID like a root node */}
							<input
								className="nodrag"
								value={name}
								onChange={(e) => {
									// updateNodeName(id, e.target.value)
									setName(e.target.value)
									data.name = e.target.value
								}}
							/>
						</div>
						<div className="nodrag">
							<IconButton
								background="black"
								color="white"
								radius="3px"
								Icon={PlusCircleIcon}
								onClick={() => addField('data')}
							/>
						</div>
					</div>

					<div style={{ alignSelf: 'center' }}>
						{expanded ? (
							// @ts-ignore
							// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
							<div
								style={{ cursor: 'pointer' }}
								onClick={() => setExpanded(!expanded)}
							>
								<ChevronUpIcon
									stroke="white"
									fill="white"
									width={32}
								/>
							</div>
						) : (
							// @ts-ignore
							// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
							<div
								style={{ cursor: 'pointer' }}
								onClick={() => setExpanded(!expanded)}
							>
								<ChevronDownIcon
									stroke="white"
									fill="white"
									width={32}
								/>
							</div>
						)}
					</div>

					{expanded && (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 4,
							}}
							className="nodrag"
						>
							{fields.map((field, index) => {
								switch (field.type) {
									case 'data':
										return (
											<ObjectField
												// color={data.color}
												add={addHandle}
												id={id}
												key={field.key}
												k={field.key}
												v={field.value}
												index={index}
												update={updateDataFieldKey}
												del={deleteField}
												error={errors[index] || false}
											/>
										)
									default:
										return <></>
								}
							})}
						</div>
					)}

					<Handle
						type="source"
						style={{ top: 20 }}
						position={Position.Right}
						id={id}
						// style={{ background: '#555' }}
						// isConnectable={isConnectable}
					/>
				</FlexColumn>
			</Node>
		</>
	)
}
