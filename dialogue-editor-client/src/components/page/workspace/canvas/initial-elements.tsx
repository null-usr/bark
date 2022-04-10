import { Node, Position } from 'react-flow-renderer'
import DialogueNode from '../../../../helpers/DialogueNode'
import DialogueEdge from '../../../../helpers/DialogueEdge'
import { RootNode } from '../../../../helpers/RootNode'

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
		},
	},
]

export default initialElements
