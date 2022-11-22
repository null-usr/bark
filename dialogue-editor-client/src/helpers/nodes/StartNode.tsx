import React from 'react'
import { XYPosition } from 'reactflow'

class StartNode {
	readonly id: string = '0'

	readonly type: string = 'input'

	readonly selectable: boolean = false

	readonly data: object = {
		label: <h2>Start Node</h2>,
	}

	position: XYPosition = { x: 100, y: 100 }
}

export default StartNode
