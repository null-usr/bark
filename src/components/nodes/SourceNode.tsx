import React, { useEffect, useRef, useState } from 'react'
import {
	Handle,
	NodeProps,
	Position,
	useReactFlow,
	useUpdateNodeInternals,
	XYPosition,
} from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import useStore from '@/store/store'
import { Node } from '@/helpers/theme'
import { Field } from '@/helpers/types'
import { getOutgoingEdges } from '@/helpers/edgeHelpers'
import { types } from '@/store/reducer'

import { ObjectField } from '../FieldComponents/ObjectField'
import { FlexColumn, FlexRow } from '../styles'
import PlusCircleIcon from '../Icons/PlusCircle'
import IconButton from '../Button/IconButton'
import ChevronUpIcon from '../Icons/ChevronUp'
import ChevronDownIcon from '../Icons/ChevronDown'
import ColorInput from '../ColorInput'
import { ButtonRow, NodeHeader } from './styles'
import NotepadIcon from '../Icons/Notepad'
import BookmarkIcon from '../Icons/Bookmark'
import CloseIcon from '../Icons/Close'

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
	color: string
}>) => {
	const { edges, mode, nodes, deleteNode, dispatch, updateNodeColor } =
		useStore()

	// when updating handles programmatically, this is needed
	const updateNodeInternals = useUpdateNodeInternals()

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
	}, [sourceArray, expanded])

	useEffect(() => {
		setFields([...data.fields])
	}, [data])

	return (
		<>
			<Node
				color={data.color}
				dragging={dragging}
				selected={selected}
				// style={{ padding: 8 }}
			>
				<FlexColumn>
					<NodeHeader color={data.color}>
						<div
							style={{
								display: 'flex',
								gap: 16,
								justifyContent: 'space-around',
								alignItems: 'center',
								marginRight: 16,
							}}
						>
							<FlexRow style={{ flex: 2 }}>
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
								<ColorInput
									width="32px"
									height="32px"
									value={data.color}
									onChange={(color) =>
										updateNodeColor(id, color)
									}
								/>
							</FlexRow>
							<div className="nodrag">
								<IconButton
									background="black"
									color="white"
									radius="3px"
									Icon={PlusCircleIcon}
									onClick={() => addField('data')}
								/>
							</div>
							<IconButton
								background="black"
								color="white"
								radius="3px"
								Icon={CloseIcon}
								width={32}
								height={32}
								onClick={() => deleteNode(id)}
							/>
						</div>
					</NodeHeader>

					<FlexColumn style={{ padding: 16 }}>
						<div style={{ alignSelf: 'center' }}>
							<IconButton
								Icon={
									expanded ? ChevronUpIcon : ChevronDownIcon
								}
								background="black"
								color="white"
								hover="gray"
								onClick={() => setExpanded(!expanded)}
							/>
						</div>
						{expanded && (
							<ButtonRow style={{ alignSelf: 'center' }}>
								<IconButton
									background="black"
									color="white"
									radius="3px"
									Icon={PlusCircleIcon}
									onClick={() => addField('data')}
								/>
								<IconButton
									background="black"
									radius="3px"
									color="white"
									Icon={NotepadIcon}
									onClick={() =>
										dispatch({
											type: types.setNode,
											data: id,
										})
									}
								/>
								{/* we can only save in non-customize mode */}
								{mode !== 'customize' && (
									<IconButton
										background="black"
										radius="3px"
										Icon={BookmarkIcon}
										color="white"
										onClick={() =>
											dispatch({
												type: types.setSaveNodes,
												data: nodes.filter(
													(n) => n.id === id
												),
											})
										}
									/>
								)}
							</ButtonRow>
						)}

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
													color={data.color}
													add={addHandle}
													id={id}
													key={field.key}
													k={field.key}
													v={field.value}
													index={index}
													update={updateDataFieldKey}
													del={deleteField}
													error={
														errors[index] || false
													}
												/>
											)
										default:
											return <></>
									}
								})}
							</div>
						)}
					</FlexColumn>

					<Handle
						type="source"
						style={{
							background: data.color,
							borderColor: 'black',
							top: 25,
						}}
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
