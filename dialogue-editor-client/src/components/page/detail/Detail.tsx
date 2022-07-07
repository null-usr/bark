import React, { MouseEventHandler, useContext, useState } from 'react'
import {
	Node,
	useNodesState,
	useReactFlow,
	useUpdateNodeInternals,
} from 'react-flow-renderer'
import { FlowContext } from '../../../contexts/FlowContext'
import BasicNode from '../../../helpers/nodes/BasicNode'
import { DialogueNode } from '../../../helpers/nodes/DialogueNode'
import useStore, { types } from '../../../store/store'
import Dimmer from '../../modal/Dimmer'
import { Container } from './styles'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
	nodeID: string
	// dialogue: string
	// setDialogue: Function
}> = ({ close, /* dialogue */ nodeID, isOpen /* , setDialogue */ }) => {
	const reactFlowInstance = useReactFlow()

	const { nodes, dispatch, updateDialogueData } = useStore()
	const [, setNodes] = useNodesState(nodes)

	const editNode = reactFlowInstance.getNode(nodeID) as DialogueNode
	const [dialogue, setDialogue] = useState(editNode.data?.dialogue || '')

	const updateNodeInternals = useUpdateNodeInternals()

	if (!editNode) return null

	return (
		<>
			<Dimmer
				isOpen={isOpen}
				onClick={() => {
					const nodeData = {
						characterName: editNode.data?.characterName,
						dialogue,
						id: nodeID,
					}
					// dispatch({
					// 	type: types.editNode,
					// 	data: { nodeID, nodeData },
					// })
					updateDialogueData(nodeID, dialogue)
					close()
				}}
			/>
			<Container>
				<div>{editNode.id}</div>
				<textarea
					value={dialogue}
					onChange={(e) => {
						// editNode.data!.dialogue = e.target.value
						setDialogue(e.target.value)
					}}
				/>
				{/* <textarea
					value={dialogue}
					onChange={(e) => {
						setDialogue(e.target.value)
					}}
				/> */}
				{/* {dialogueNode.dialogue} */}
			</Container>
		</>
	)
}

export default Detail
