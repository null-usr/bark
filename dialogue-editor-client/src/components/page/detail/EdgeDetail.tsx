import React, { MouseEventHandler, useContext, useState } from 'react'
import {
	Node,
	useNodesState,
	useReactFlow,
	useUpdateNodeInternals,
} from 'react-flow-renderer'
import { FlowContext } from '../../../contexts/FlowContext'
import DataEdge from '../../../helpers/DataEdge'
import { getCount } from '../../../helpers/getCount'
import BasicNode from '../../../helpers/nodes/BasicNode'
import { DialogueNode } from '../../../helpers/nodes/DialogueNode'
import useStore, { types } from '../../../store/store'
import Dimmer from '../../modal/Dimmer'
import { Container } from './styles'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
	edgeID: string
	// dialogue: string
	// setDialogue: Function
}> = ({ close, /* dialogue */ edgeID, isOpen /* , setDialogue */ }) => {
	const reactFlowInstance = useReactFlow()
	const { nodes, dispatch, updateDialogueData } = useStore()

	const editEdge = reactFlowInstance.getEdge(edgeID) as DataEdge
	const [name, setName] = useState(editEdge.data.name)
	const [id, setID] = useState(edgeID || '')

	if (!editEdge) return null

	return (
		<>
			<Dimmer
				isOpen={isOpen}
				onClick={() => {
					const edgeData = {
						name,
						id,
					}
					// in this case ID doesn't matter because when we export
					// the ID will be whatever is in data (hopefully)

					dispatch({
						type: types.editEdge,
						data: { edgeID, edgeData },
					})
					// updateDialogueData(nodeID, dialogue)
					close()
				}}
			/>
			<Container>
				{/* <input value={id} onChange={(e) => setID(e.target.value)} /> */}
				<input value={name} onChange={(e) => setName(e.target.value)} />
			</Container>
		</>
	)
}

export default Detail
