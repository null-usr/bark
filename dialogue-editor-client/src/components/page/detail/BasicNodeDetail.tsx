import React, {
	MouseEventHandler,
	useContext,
	useEffect,
	useState,
} from 'react'
import {
	Edge,
	Node,
	useNodesState,
	useReactFlow,
	useUpdateNodeInternals,
} from 'reactflow'
import { FlowContext } from '../../../contexts/FlowContext'
import {
	getIncomingEdges,
	getOutgoingEdges,
} from '../../../helpers/edgeHelpers'
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
}> = ({ close, isOpen }) => {
	const reactFlowInstance = useReactFlow()

	const { nodes, edges, nodeID, dispatch, updateDialogueData } = useStore()

	if (!nodeID) return null

	const editNode = reactFlowInstance.getNode(nodeID) as BasicNode

	if (!editNode) return null

	const edgesOut = getOutgoingEdges(nodeID, edges)
	const edgesIn = getIncomingEdges(nodeID, edges)

	const naturalOutgoingEdges = edgesOut.filter(
		(e) => e.sourceHandle === null || e.sourceHandle === e.source
	)

	const [name, setName] = useState(editNode.data.name)
	const [id, setID] = useState(nodeID || '')
	const [color, setColor] = useState(editNode.data.color)
	const [fields, setFields] = useState<Field[]>(editNode.data.fields || [])
	const [count, setCount] = useState(fields.length)

	const addField = (type: string) => {
		setFields([
			...fields,
			{ key: `key ${count}`, value: `value ${count}`, type },
		])
		setCount(count + 1)
	}

	const updateField = (index: number, k: string, v: any) => {
		const c = fields.filter((f) => f.key === k)
		if (c.length > 1) {
			console.log('duplicate key values')
			return
		}
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		item.value = v
		f[index] = item
		setFields(f)
	}

	const updateDataField = (index: number, v: string) => {
		const c = fields.filter((f) => f.key === v)
		if (c.length > 0) {
			console.log('duplicate key values')
			return
		}
		// console.log(v)
		const f = [...fields]
		const item = { ...f[index] }
		item.value = v
		f[index] = item
		setFields(f)
	}

	// https://stackoverflow.com/questions/43230622/reactjs-how-to-delete-item-from-list/43230714
	const deleteField = (fieldID: string) => {
		setFields(fields.filter((el) => el.key !== fieldID))
	}

	useEffect(() => {
		setID(nodeID)
		setName(editNode.data.name)
		setFields(editNode.data.fields || [])
		setCount(fields.length)
	}, [nodeID])

	return (
		<>
			<Dimmer
				isOpen={isOpen}
				onClick={() => {
					const nodeData = {
						id,
						name,
						color,
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
				<input value={name} onChange={(e) => setName(e.target.value)} />
				<input value={id} onChange={(e) => setID(e.target.value)} />
				<input
					type="color"
					defaultValue={color}
					onChange={(evt) => setColor(evt.target.value)}
					className="nodrag"
				/>
				<ButtonRow>
					<button onClick={() => addField('string')}>Text</button>
					<button onClick={() => addField('bool')}>Boolean</button>
					<button onClick={() => addField('number')}>Number</button>
					<button onClick={() => addField('data')}>data</button>
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
						// TODO: proper implementation
						case 'text':
							return (
								<>
									{field.key}:
									<textarea />
								</>
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
						case 'data':
							return (
								<div>
									<input
										type="text"
										value={field.value}
										onChange={(e) => {
											updateField(
												index,
												field.key,
												e.target.value
											)
										}}
									/>
									:
									{/* TODO: this may have multiple target nodes, think of a UI/UX for this */}
									<button>Create</button>
									<button
										disabled={
											edgesOut.filter(
												(e) =>
													e.sourceHandle === field.key
											).length === 0
										}
										onClick={() => {
											const targetNodeID =
												edgesOut.filter(
													(e) =>
														e.sourceHandle ===
														field.key
												)[0]?.target

											dispatch({
												type: types.setNode,
												data: targetNodeID,
											})
										}}
									>
										Go
									</button>
								</div>
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
				Incoming
				{edgesIn.map((e) => {
					return (
						<button
							onClick={() =>
								dispatch({
									type: types.setNode,
									data: e.source,
								})
							}
						>
							{e.source}
						</button>
					)
				})}
				Outgoing
				{naturalOutgoingEdges.map((e) => {
					return (
						<button
							onClick={() =>
								dispatch({
									type: types.setNode,
									data: e.target,
								})
							}
						>
							{e.target}
						</button>
					)
				})}
			</Container>
		</>
	)
}

export default Detail
