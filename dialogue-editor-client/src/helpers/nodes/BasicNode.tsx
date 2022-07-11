import React, { useState, useEffect, createRef } from 'react'
import {
	Handle,
	Position,
	NodeProps,
	Connection,
	Edge,
	XYPosition,
} from 'react-flow-renderer'

import { render } from 'react-dom'
import { v4 as uuidv4 } from 'uuid'
import { StringField } from '../FieldComponents/StringField'
import { ButtonRow, Container } from '../styles'
import { Field } from '../types'
import { BooleanField } from '../FieldComponents/BooleanField'
import { NumberField } from '../FieldComponents/NumberField'
import useStore, { RFState, types } from '../../store/store'

export class BasicNode {
	id: string
	fields: Field[]
	data: { fields?: Field[] } = {}

	nodeData: any
	type: string

	sourcePosition: Position
	targetPosition: Position
	position: XYPosition

	constructor(
		x: number,
		y: number,
		id?: string,
		data?: Field[],
		TB?: boolean
	) {
		this.id = id || uuidv4()
		this.position = { x, y }
		this.fields = data || []
		this.type = 'basic'
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
			fields: this.fields,
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
	return new BasicNode(x, y, undefined, [
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
}: NodeProps<{ fields: Field[] }>) => {
	const [fields, setFields] = useState<Field[]>(data.fields || [])
	const [count, setCount] = useState(1)

	const dispatch = useStore((store: RFState) => store.dispatch)

	function SerializeNode(
		name: string,
		type: string,
		f: Field[],
		className: string
	) {
		const out = {
			name,
			type,
			className,
			fields: f,
		}

		dispatch({ type: types.addCustomNode, data: out })
	}

	const addField = (type: string) => {
		let value
		if (type === 'string') {
			value = `value ${count}`
		} else if (type === 'number') {
			value = 0
		} else {
			value = false
		}
		setFields([...fields, { key: `key ${count}`, value, type }])
		setCount(count + 1)
	}

	const updateField = (index: number, k: string, v: string) => {
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		item.value = v
		f[index] = item
		setFields(f)
	}

	// https://stackoverflow.com/questions/43230622/reactjs-how-to-delete-item-from-list/43230714
	const deleteField = (fieldID: string) => {
		setFields(fields.filter((el) => el.key !== fieldID))
	}

	useEffect(() => {
		data.fields = fields
	}, [fields])

	return (
		<>
			<Handle
				type="target"
				position={Position.Left}
				style={{ background: '#555' }}
				onConnect={(params) => console.log('handle onConnect', params)}
				isConnectable={isConnectable}
			/>
			<Container>
				<p>{id}</p>
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
							SerializeNode(
								'placeholder',
								'base',
								fields,
								'node react-flow__node-default'
							)
						}
					>
						Save
					</button>
				</ButtonRow>
				<ButtonRow>
					<button onClick={() => addField('string')}>Text</button>
					<button onClick={() => addField('bool')}>Boolean</button>
					<button onClick={() => addField('number')}>Number</button>
				</ButtonRow>
				<div className="nodrag">
					{data.fields.map((field, index) => {
						switch (field.type) {
							case 'string':
								return (
									<StringField
										updateField={updateField}
										del={deleteField}
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
									/>
								)
							case 'text':
								return (
									<StringField
										updateField={updateField}
										del={deleteField}
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
									/>
								)
							case 'bool':
								return (
									<BooleanField
										updateField={updateField}
										del={deleteField}
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
									/>
								)
							case 'number':
								return (
									<NumberField
										updateField={updateField}
										del={deleteField}
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
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
				// id="b"
				style={{ background: '#555' }}
				isConnectable={isConnectable}
			/>
		</>
	)
}
