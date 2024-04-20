import { Position, XYPosition } from 'reactflow'
import { createRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Field } from '../types'

// class to help create basic nodes
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
			type: 'base',
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
