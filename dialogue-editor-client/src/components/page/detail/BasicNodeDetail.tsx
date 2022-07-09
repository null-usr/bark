import React, { MouseEventHandler, useContext, useState } from 'react'
import {
	Node,
	useNodesState,
	useReactFlow,
	useUpdateNodeInternals,
} from 'react-flow-renderer'
import { FlowContext } from '../../../contexts/FlowContext'
import { BooleanField } from '../../../helpers/FieldComponents/BooleanField'
import { NumberField } from '../../../helpers/FieldComponents/NumberField'
import { StringField } from '../../../helpers/FieldComponents/StringField'
import { getCount } from '../../../helpers/getCount'
import { BasicNode } from '../../../helpers/nodes/BasicNode'
import { DialogueNode } from '../../../helpers/nodes/DialogueNode'
import { ButtonRow } from '../../../helpers/styles'
import { Field } from '../../../helpers/types'
import useStore, { types } from '../../../store/store'
import Dimmer from '../../modal/Dimmer'
import { Container } from './styles'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
	nodeID: string
}> = ({ close, nodeID, isOpen }) => {
	const reactFlowInstance = useReactFlow()

	const { nodes, dispatch, updateDialogueData } = useStore()

	const editNode = reactFlowInstance.getNode(nodeID) as BasicNode

	const [id, setID] = useState(nodeID || '')
	const [fields, setFields] = useState<Field[]>(editNode.data.fields || [])
	const [count, setCount] = useState(1)

	const addField = (type: string) => {
		setFields([
			...fields,
			{ key: `key ${count}`, value: `value ${count}`, type },
		])
		setCount(count + 1)
	}

	const updateField = (index: number, k: string, v: any) => {
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

	if (!editNode) return null

	return (
		<>
			<Dimmer
				isOpen={isOpen}
				onClick={() => {
					const nodeData = {
						id,
						fields,
					}

					const idCheck = getCount(nodes, 'id', id)

					if (idCheck === 1 && id !== nodeID) {
						/* vendors contains the element we're looking for */
						console.log('node ID conflict')
					} else {
						dispatch({
							type: types.editNode,
							data: { nodeID, nodeData },
						})
						// updateDialogueData(nodeID, dialogue)
						close()
					}
				}}
			/>
			<Container>
				<input value={id} onChange={(e) => setID(e.target.value)} />
				<ButtonRow>
					<button onClick={() => addField('string')}>Text</button>
					<button onClick={() => addField('bool')}>Boolean</button>
					<button onClick={() => addField('number')}>Number</button>
				</ButtonRow>
				{/*  */}
				{/* <textarea
					value={dialogue}
					onChange={(e) => {
						// editNode.data!.dialogue = e.target.value
						setDialogue(e.target.value)
					}}
				/> */}
				{fields.map((field, index) => {
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
