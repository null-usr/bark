import React, { MouseEventHandler, useState } from 'react'
import BasicNode from '../../../helpers/BasicNode'
import { DialogueNode } from '../../../helpers/DialogueNode'
import Dimmer from '../../modal/Dimmer'
import { Container } from './styles'

const Detail: React.FC<{
	close: MouseEventHandler<HTMLElement>
	isOpen: boolean
	dialogueNode: DialogueNode
	// dialogue: string
	// setDialogue: Function
}> = ({ close, /* dialogue */ dialogueNode, isOpen /* , setDialogue */ }) => {
	const [dialogue, setDialogue] = useState(dialogueNode.dialogue)
	return (
		<>
			<Dimmer isOpen={isOpen} onClick={close} />
			<Container>
				<div>{dialogueNode.id}</div>
				<textarea
					value={dialogue}
					onChange={(e) => {
						dialogueNode.dialogue = e.target.value
						dialogueNode.updateDialogue()
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
