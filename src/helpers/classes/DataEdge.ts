import { createRef } from 'react'
import { Connection } from 'reactflow'

// similar to BasicNode, need to get fields from it
export class DataEdge implements Connection {
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
		name?: string,
		data?: string
	) {
		this.id = `${source}-${sourceHandle}-${target}`

		if (name) {
			this.name = name
		} else {
			this.name = ''
		}

		this.source = source
		this.sourceHandle = sourceHandle
		this.target = target
		this.targetHandle = targetHandle

		this.edgeData = createRef()

		if (!data) {
			this._set_data()
		} else {
			this.data = data
		}
	}

	_set_data() {
		this.data = {
			name: this.name,
			fields: [],
		}
	}
}
