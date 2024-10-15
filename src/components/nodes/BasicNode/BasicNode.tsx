/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react'
import { Handle, Position, NodeProps, useUpdateNodeInternals } from 'reactflow'
import { ReactComponent as ChevronDownIcon } from '@/assets/icons/chevron_down.svg'
import { ReactComponent as ChevronUpIcon } from '@/assets/icons/chevron_up.svg'

import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { Node } from '@/helpers/theme'
import { Field } from '@/helpers/types'
import { getOutgoingEdges } from '@/helpers/edgeHelpers'
import SaveIcon from '@/components/Icons/Save'
import { StringField } from '../../FieldComponents/StringField'
import { NodeHeader, ButtonRow, Container } from '../styles'
import { FlexColumn, FlexRow } from '../../styles'
import IconButton from '../../Button/IconButton'
import ColorInput from '../../ColorInput'
import NotepadIcon from '../../Icons/Notepad'
import CloseIcon from '../../Icons/Close'
// import BookmarkIcon from '../../Icons/Bookmark'
import AddFields from './AddFields'
import { renderField } from './renderField'

// https://www.carlrippon.com/react-forwardref-typescript/
export default ({
	id,
	data,
	isConnectable,
	selected,
}: NodeProps<{ name: string; color: string; fields: Field[] }>) => {
	const {
		nodes,
		edges,
		workspace,
		mode,
		updateNodeColor,
		// updateNodeName,
		deleteNode,
	} = useStore()

	const nodeRef = useRef<HTMLDivElement>(null)
	// const [nodeWidth, setNodeWidth] = useState(50)
	// const [nodeHeight, setNodeHeight] = useState(50)

	const [fields, setFields] = useState<Field[]>(data.fields || [])
	const [name, setName] = useState<string>(data.name)

	const [count, setCount] = useState(fields.length)
	const [sourceArray, setSourceArray] = useState<any[]>(
		data.fields.filter((f) => f.type === 'data').map((f) => f.value) || []
	)
	const [expanded, setExpanded] = useState(true)

	// when updating handles programmatically, this is needed
	const updateNodeInternals = useUpdateNodeInternals()
	const dispatch = useStore((store) => store.dispatch)

	const [errors, setErrors] = useState<{ [key: number]: boolean }>({})

	const addHandle = (key: string) => {
		setSourceArray([...sourceArray, key])
	}

	const addField = (type: string) => {
		let value
		if (type === 'string' || type === 'text') {
			value = `value ${count}`
		} else if (type === 'number') {
			value = 0
		} else if (type === 'data') {
			// We create a handle with a key of key:{count}
			value = `value ${count}`
			addHandle(`key:${count}`)
			setFields([...data.fields, { key: `key:${count}`, value, type }])
			data.fields = [...data.fields, { key: `key:${count}`, value, type }]
			setCount(count + 1)
			return
		} else if (type === 'custom') {
			value = { workspaceVar: '', value: '' }
		} else {
			value = false
		}

		setFields([...data.fields, { key: `key: ${count}`, value, type }])
		data.fields = [...data.fields, { key: `key: ${count}`, value, type }]

		setCount(count + 1)
	}

	const updateKey = (index: number, k: string) => {
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

		setErrors({})
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		f[index] = item
		setFields(f)

		data.fields[index] = { ...data.fields[index], key: k }
	}

	// if we update the key, we need to update the handle ID used by the edge
	// associated with this field
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

	const updateValue = (index: number, v: any) => {
		const f = [...fields]
		const item = { ...f[index] }
		item.value = v
		f[index] = item
		setFields(f)

		data.fields[index] = { ...data.fields[index], value: v }
	}

	const deleteField = (fieldID: string) => {
		setFields(fields.filter((el) => el.key !== fieldID))
		data.fields = data.fields.filter((el) => el.key !== fieldID)
	}

	useEffect(() => {
		updateNodeInternals(id)
	}, [sourceArray, expanded])

	useEffect(() => {
		setFields([...data.fields])
	}, [data])

	// useEffect(() => {
	// 	if (nodeRef.current) {
	// 		setNodeWidth(nodeRef.current.offsetWidth)
	// 		setNodeHeight(nodeRef.current.offsetHeight)
	// 	}
	// }, [data, expanded])

	// const controlStyle = {
	// 	background: 'transparent',
	// 	border: 'none',
	// }

	return (
		<Node color={data.color} selected={selected}>
			{/* TODO: disabled until vertical resize can play well w/ 
			additional fields being added */}
			{/* {expanded && (
				<NodeResizeControl
					style={controlStyle}
					minWidth={nodeWidth}
					minHeight={nodeHeight}
				>
					<ResizeIcon />
				</NodeResizeControl>
			)} */}
			<Handle
				style={{
					borderColor: 'black',
					background: data.color,
					top: 70,
				}}
				type="target"
				position={Position.Left}
				onConnect={(params) => {}}
				isConnectable={isConnectable}
			/>

			<Container ref={nodeRef}>
				<NodeHeader color={data.color}>
					<FlexRow style={{ justifyContent: 'space-between' }}>
						<FlexRow style={{ alignItems: 'center' }}>
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
								onChange={(color) => updateNodeColor(id, color)}
							/>
						</FlexRow>
						<ButtonRow>
							<IconButton
								background="black"
								radius="3px"
								color="white"
								Icon={NotepadIcon}
								onClick={() =>
									dispatch({ type: types.setNode, data: id })
								}
							/>
							{/* we can only save in non-customize mode */}
							{mode !== 'customize' && (
								<IconButton
									background="black"
									radius="3px"
									Icon={SaveIcon}
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
							<IconButton
								background="black"
								color="white"
								radius="3px"
								Icon={CloseIcon}
								width={32}
								height={32}
								onClick={() => deleteNode(id)}
							/>
						</ButtonRow>
					</FlexRow>
				</NodeHeader>

				<Container style={{ padding: 8 }}>
					<div style={{ alignSelf: 'center' }}>
						{expanded ? (
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
						<>
							<AddFields
								addField={addField}
								hasCustomVars={
									Object.keys(workspace.w_vars).length > 0
								}
							/>
							<FlexColumn
								style={{
									gap: 4,
								}}
								className="nodrag"
							>
								{fields.map((field, index) => {
									return renderField(
										field,
										index,
										data.color,
										errors[index] || false,
										id,
										updateKey,
										deleteField,
										updateValue,
										updateDataFieldKey,
										addHandle
									)
								})}
							</FlexColumn>
						</>
					)}
				</Container>
			</Container>
			<Handle
				style={{
					background: data.color,
					top: 70,
					borderColor: 'black',
				}}
				type="source"
				position={Position.Right}
				id={id}
				isConnectable={isConnectable}
			/>
			{!expanded && (
				<>
					{sourceArray.map((h) => (
						<Handle
							type="source"
							key={h}
							id={h}
							position={Position.Right}
							onClick={undefined}
							style={{
								top: 70,
								pointerEvents: 'none',
								borderColor: 'black',
								background: data.color,
							}}
							isConnectable={false}
						/>
					))}
				</>
			)}
		</Node>
	)
}
