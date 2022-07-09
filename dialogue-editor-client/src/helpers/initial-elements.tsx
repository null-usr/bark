import { Node, Position } from 'react-flow-renderer'

const initialElements: Node[] = [
	{
		id: 'root',
		type: 'root',
		selectable: true,
		position: { x: 100, y: 100 },
		sourcePosition: Position.Left,
		targetPosition: Position.Right,
		data: {
			label: 'ROOT',
			sources: [],
			targets: [],
			id: 'root,',
		},
	},
	{
		id: '1',
		type: 'colorChooser',
		data: { color: '#4FD1C5' },
		position: { x: 250, y: 25 },
	},

	{
		id: '2',
		type: 'colorChooser',
		data: { color: '#F6E05E' },
		position: { x: 100, y: 125 },
	},
	{
		id: '3',
		type: 'colorChooser',
		data: { color: '#B794F4' },
		position: { x: 250, y: 250 },
	},
]

export default initialElements
