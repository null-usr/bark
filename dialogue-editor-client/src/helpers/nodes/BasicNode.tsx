import React, { useState, useEffect, createRef, useMemo } from 'react'
import {
	Handle,
	Position,
	NodeProps,
	Connection,
	Edge,
	XYPosition,
	useUpdateNodeInternals,
} from 'react-flow-renderer'

import { render } from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import { StringField } from '../FieldComponents/StringField'
import { ButtonRow, Container } from '../styles'
import { Field } from '../types'
import { BooleanField } from '../FieldComponents/BooleanField'
import { NumberField } from '../FieldComponents/NumberField'
import useStore, { RFState, types } from '../../store/store'
import { ObjectField } from '../FieldComponents/ObjectField'
import { NodeHeader } from './styles'
import { SerializeNode } from '../serialization'

export class BasicNode {
	id: string
	color: string
	name: string
	fields: Field[]
	data: { name: string; color: string; fields?: Field[]; type: string } = {
		name: '',
		color: '',
		type: 'basic',
	}

	nodeData: any
	type: string

	sourcePosition: Position
	targetPosition: Position
	position: XYPosition

	constructor(
		name: string,
		x: number,
		y: number,
		id?: string,
		data?: Field[],
		color?: string,
		TB?: boolean
	) {
		this.id = id || uuidv4()
		this.position = { x, y }
		this.fields = data || []
		this.type = 'base'
		this.name = name
		this.color = color || '#FFFFFF'
		this.nodeData = createRef()
		this._set_data()

		if (TB) {
			this.sourcePosition = Position.Bottom
			this.targetPosition = Position.Top
		} else {
			this.sourcePosition = Position.Right
			this.targetPosition = Position.Left
		}
	}

	private _set_data() {
		this.data = {
			color: this.color,
			name: this.name,
			fields: this.fields,
			type: 'baase',
		}
	}

	// here we look into our component and grab all the data we need
	public serialize = (): {
		[id: string]: {
			[key: string]: [value: string]
		}
	} => {
		if (this.nodeData.current) {
			const data = this.nodeData.current.getNodeData()
			const output: any = {}
			output[this.id] = {}
			data.forEach((element: Field) => {
				output[this.id][element.key] = element.value
			})
			return output
		}
		return {}
	}
}

// example function
export function CreateDialogueNode(x: number, y: number) {
	return new BasicNode('Dialogue Node', x, y, undefined, [
		{
			key: 'characterName',
			type: 'string',
			value: '',
		},
		{
			key: 'dialogue',
			type: 'text',
			value: '',
		},
	])
}

// https://www.carlrippon.com/react-forwardref-typescript/
// https://stackoverflow.com/questions/37949981/call-child-method-from-parent
// need to do a check that all the keys are unique
export default ({
	id,
	data,
	isConnectable,
}: NodeProps<{ name: string; color: string; fields: Field[] }>) => {
	const [fields, setFields] = useState<Field[]>(data.fields || [])
	const [count, setCount] = useState(fields.length)
	const { edges } = useStore()
	const [sourceArray, setSourceArray] = useState<any[]>(
		data.fields.filter((f) => f.type === 'data').map((f) => f.value) || []
	)

	const updateNodeColor = useStore((state) => state.updateNodeColor)
	const updateNodeName = useStore((state) => state.updateNodeName)

	// when updating handles programmatically, this is needed
	const updateNodeInternals = useUpdateNodeInternals()
	const dispatch = useStore((store: RFState) => store.dispatch)

	useEffect(() => {
		updateNodeInternals(id)
	}, [sourceArray])

	// ideally this would use a reference to get the position (offsetTop)
	const positionHandle = (index: number) => {
		return 104 + 22 * index
	}

	const sourceHandles = useMemo(
		() =>
			sourceArray.map((x: string, i: number) => {
				const handleID = `source-handle-${x}`
				return (
					<Handle
						key={handleID}
						type="source"
						position={Position.Right}
						id={handleID}
						style={{ top: positionHandle(i), right: -16 }}
						onContextMenu={(event) => {
							event.preventDefault()
							const edge: Edge<any> = edges.filter((e) => {
								return e.source === handleID
							})[0]

							dispatch({ type: types.deleteEdge, data: edge.id })
						}}
					/>
				)
			}),
		[sourceArray, positionHandle]
	)

	const addHandle = (key: string) => {
		if (sourceArray.length < 10) {
			setSourceArray([...sourceArray, key])
		}
	}

	const addField = (type: string) => {
		let value
		if (type === 'string') {
			value = `value ${count}`
		} else if (type === 'number') {
			value = 0
		} else if (type === 'data') {
			value = `value ${count}`
			addHandle(`key:${count}`)
			setFields([...data.fields, { key: `key:${count}`, value, type }])
			data.fields = [...data.fields, { key: `key:${count}`, value, type }]
			setCount(count + 1)
			return
		} else {
			value = false
		}

		setFields([...data.fields, { key: `key ${count}`, value, type }])
		data.fields = [...data.fields, { key: `key ${count}`, value, type }]

		setCount(count + 1)
	}

	const updateField = (index: number, k: string, v: string) => {
		const c = fields.filter((f) => f.key === k)
		if (c.length > 1) {
			console.log('duplicate key values')
			return
		}
		// console.log(v)
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		item.value = v
		f[index] = item
		setFields(f)

		data.fields[index] = { ...data.fields[index], key: k, value: v }
	}

	const updateDataField = (index: number, v: string) => {
		const c = fields.filter((f) => f.key === v)
		if (c.length > 0) {
			console.log('duplicate key values')
			return
		}
		// console.log(v)
		const f = [...fields]
		const item = { ...f[index] }
		item.value = v
		f[index] = item
		setFields(f)

		data.fields[index] = { ...data.fields[index], value: v }
	}

	// https://stackoverflow.com/questions/43230622/reactjs-how-to-delete-item-from-list/43230714
	const deleteField = (fieldID: string) => {
		setFields(fields.filter((el) => el.key !== fieldID))
		data.fields = data.fields.filter((el) => el.key !== fieldID)
	}

	// useEffect(() => {
	// 	data.fields = fields
	// }, [fields])

	return (
		<>
			<Handle
				type="target"
				position={Position.Left}
				style={{ background: '#555' }}
				onConnect={(params) => console.log('handle onConnect', params)}
				isConnectable={isConnectable}
			/>
			{/* {sourceHandles} */}
			<Container className="node react-flow__node-default">
				<NodeHeader color={data.color}>
					<input
						value={data.name}
						onChange={(e) => {
							updateNodeName(id, e.target.value)
						}}
					/>
					<div style={{ padding: 20 }}>
						<input
							type="color"
							defaultValue={data.color}
							onChange={(evt) =>
								updateNodeColor(id, evt.target.value)
							}
							className="nodrag"
						/>
					</div>
				</NodeHeader>
				<ButtonRow>
					<button
						onClick={() =>
							dispatch({ type: types.setNode, data: id })
						}
					>
						Edit
					</button>
					<button
						onClick={() =>
							dispatch({
								type: types.addCustomNode,
								data: SerializeNode(
									data.name,
									data.color,
									'base',
									fields
								),
							})
						}
					>
						Save
					</button>
				</ButtonRow>
				<ButtonRow>
					<button onClick={() => addField('string')}>Text</button>
					<button onClick={() => addField('bool')}>Boolean</button>
					<button onClick={() => addField('number')}>Number</button>
					<button onClick={() => addField('data')}>data</button>
				</ButtonRow>
				<div className="nodrag">
					{data.fields.map((field, index) => {
						switch (field.type) {
							case 'string':
								return (
									<StringField
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
										updateField={updateField}
										del={deleteField}
									/>
								)
							case 'text':
								return (
									<StringField
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
										updateField={updateField}
										del={deleteField}
									/>
								)
							case 'bool':
								return (
									<BooleanField
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
										updateField={updateField}
										del={deleteField}
									/>
								)
							case 'number':
								return (
									<NumberField
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
										updateField={updateField}
										del={deleteField}
									/>
								)
							case 'data':
								return (
									<ObjectField
										add={addHandle}
										id={id}
										key={field.key}
										k={field.key}
										v={field.value}
										index={index}
										update={updateDataField}
										del={deleteField}
									/>
								)
							default:
								return <></>
						}
					})}
				</div>
			</Container>
			<Handle
				type="source"
				position={Position.Right}
				id={id}
				style={{ background: '#555' }}
				isConnectable={isConnectable}
			/>
		</>
	)
}
