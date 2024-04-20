import React, { useEffect, useState } from 'react'
import { Edge, useReactFlow } from 'reactflow'
import Modal from '@/components/modal/Modal'
import { getIncomingEdges, getOutgoingEdges } from '@/helpers/edgeHelpers'
import { DataEdge } from '@/helpers/classes/DataEdge'
import { BooleanField } from '@/components/FieldComponents/BooleanField'
import { NumberField } from '@/components/FieldComponents/NumberField'
import { StringField } from '@/components/FieldComponents/StringField'
import { getCount } from '@/helpers/getCount'
import { DialogueNode } from '@/components/nodes/DialogueNode'
import { ButtonRow } from '@/helpers/styles'
import { Field } from '@/helpers/types'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'
import Divider from '@/components/Divider'
import ColorInput from '@/components/ColorInput'
import { BasicNode } from '@/helpers/classes/BasicNode'
import { Container } from './styles'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
}> = ({ close, isOpen }) => {
	const reactFlowInstance = useReactFlow()

	const {
		nodes,
		edges,
		nodeID,
		dispatch,
		updateDialogueData,
		updateNodeColor,
	} = useStore()

	if (!nodeID) return null

	const editNode = nodes.find((n) => n.id === nodeID) as BasicNode

	const edgesOut = getOutgoingEdges(nodeID, edges)
	const edgesIn = getIncomingEdges(nodeID, edges)

	const naturalOutgoingEdges = edgesOut.filter(
		(e) => e.sourceHandle === null || e.sourceHandle === e.source
	)

	const dataNodeEdges = edgesOut.filter(
		(e) => e.sourceHandle !== e.source && e.sourceHandle !== null
	)

	const [name, setName] = useState(editNode ? editNode.data.name || '' : '')
	// const [color, setColor] = useState(editNode.data.color)
	const [id, setID] = useState(nodeID || '')
	const [fields, setFields] = useState<Field[]>(
		editNode ? editNode.data.fields || [] : []
	)
	const [count, setCount] = useState(fields.length)
	const [lockID, setLockID] = useState(true)

	const [IDError, setIDError] = useState(false)

	const addField = (type: string) => {
		setFields([
			...fields,
			{ key: `key ${count}`, value: `value ${count}`, type },
		])
		setCount(count + 1)
	}

	const updateKey = (index: number, k: string) => {
		const f = [...fields]
		const item = { ...f[index] }
		item.key = k
		f[index] = item
		setFields(f)
	}

	const updateValue = (index: number, v: any) => {
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
		setName(editNode ? editNode.data.name : '')
		setFields(editNode ? editNode.data.fields || [] : [])
		setCount(fields.length)
	}, [nodeID])

	if (!editNode) return null

	return (
		<Modal
			open
			withDimmer
			close={() => {
				const nodeData = {
					id: lockID ? editNode.id : id,
					name,
					color: editNode.data.color,
					fields,
				}

				const idCheck = getCount(nodes, 'id', id)

				if (idCheck === 1 && id !== nodeID) {
					/* vendors contains the element we're looking for */
					setIDError(true)
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
		>
			<FlexRow>
				<FlexColumn style={{ flex: 1, alignItems: 'center' }}>
					INCOMING
					<Divider />
					{edgesIn.map((e) => {
						return (
							<Button
								type="secondary"
								onClick={() =>
									dispatch({
										type: types.setNode,
										data: e.source,
									})
								}
							>
								{e.source}
							</Button>
						)
					})}
				</FlexColumn>
				<Container style={{ flex: 4, gap: 4 }}>
					DATA
					<Divider />
					<FlexRow
						style={{ gap: 32, justifyContent: 'space-between' }}
					>
						<input
							style={{ flex: 1 }}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<ColorInput
							value={editNode.data.color}
							onChange={(c) => updateNodeColor(editNode.id, c)}
						/>
					</FlexRow>
					<div style={{ border: IDError ? '1px solid red' : '' }}>
						{IDError && (
							<p style={{ color: 'red' }}>
								A node with ID: {nodeID} already exists
							</p>
						)}
						<input
							disabled={lockID}
							value={id}
							onChange={(e) => setID(e.target.value)}
						/>
						<Button onClick={() => setLockID(!lockID)}>
							toggle ID lock
						</Button>
					</div>
					<ButtonRow>
						<Button onClick={() => addField('string')}>
							String
						</Button>
						<Button onClick={() => addField('text')}>Text</Button>
						<Button onClick={() => addField('bool')}>
							Boolean
						</Button>
						<Button onClick={() => addField('number')}>
							Number
						</Button>
						<Button onClick={() => addField('data')}>data</Button>
					</ButtonRow>
					{/*  */}
					{fields.map((field, index) => {
						switch (field.type) {
							case 'string':
								return (
									<StringField
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
										updateValue={updateValue}
										updateKey={updateKey}
										del={deleteField}
										// error={errors[index] || false}
									/>
								)
							// TODO: proper implementation
							case 'text':
								return (
									<>
										{field.key}:
										<textarea
											style={{ maxWidth: '100%' }}
										/>
									</>
								)
							case 'bool':
								return (
									<BooleanField
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
										updateValue={updateValue}
										updateKey={updateKey}
										del={deleteField}
										// error={errors[index] || false}
									/>
								)
							case 'number':
								return (
									<NumberField
										index={index}
										key={field.key}
										k={field.key}
										v={field.value}
										updateValue={updateValue}
										updateKey={updateKey}
										del={deleteField}
										// error={errors[index] || false}
									/>
								)
							case 'data':
								return (
									<div>
										<input
											type="text"
											value={field.value}
											onChange={(e) => {
												updateKey(index, e.target.value)
											}}
										/>
										:
										{/* TODO: this may have multiple target nodes, think of a UI/UX for this */}
										<Button
											onClick={() => {
												const newNode = new BasicNode(
													'basic',
													editNode.position.x + 300,
													editNode.position.y
												)
												const newEdge: Edge =
													new DataEdge(
														editNode.id,
														newNode.id,
														field.key,
														null
													)

												dispatch({
													type: types.addNode,
													data: newNode,
												})
												dispatch({
													type: types.addEdge,
													data: newEdge,
												})
											}}
										>
											Create
										</Button>
										<Button
											disabled={
												edgesOut.filter(
													(e) =>
														e.sourceHandle ===
														field.key
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
										</Button>
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
				</Container>
				<FlexColumn style={{ flex: 1, alignItems: 'center' }}>
					OUTGOING
					<Divider />
					Next:
					{naturalOutgoingEdges.map((e) => {
						return (
							<Button
								type="secondary"
								onClick={() =>
									dispatch({
										type: types.setNode,
										data: e.target,
									})
								}
							>
								{e.target}
							</Button>
						)
					})}
					<Button
						onClick={() => {
							const newNode = new BasicNode(
								'basic',
								editNode.position.x + 300,
								editNode.position.y +
									300 * (Math.random() * 2 - 1)
							)
							const newEdge: Edge = new DataEdge(
								editNode.id,
								newNode.id,
								editNode.id,
								null
							)

							dispatch({ type: types.addNode, data: newNode })
							dispatch({ type: types.addEdge, data: newEdge })
						}}
					>
						Add Outgoing
					</Button>
					data:
					<br />
					{/* outgoing edges not from a field */}
					{dataNodeEdges.map((e) => {
						return (
							<Button
								type="secondary"
								onClick={() =>
									dispatch({
										type: types.setNode,
										data: e.target,
									})
								}
							>
								{e.target}
							</Button>
						)
					})}
				</FlexColumn>
			</FlexRow>
		</Modal>
	)
}

export default Detail
