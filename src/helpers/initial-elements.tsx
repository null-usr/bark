import { Node, Position } from 'reactflow'

const initialElements: Node[] = [
	{
		id: 'root',
		type: 'source',
		selectable: true,
		position: { x: 100, y: 100 },
		sourcePosition: Position.Left,
		targetPosition: Position.Right,
		data: {
			name: 'ROOT',
			type: 'source',
			color: '#00FF00',
			sources: [],
			targets: [],
			fields: [],
			id: 'root',
		},
	},
]

export default initialElements
