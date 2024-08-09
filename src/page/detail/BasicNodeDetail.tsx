import React, { useEffect, useState } from 'react'
import { Edge, useReactFlow } from 'reactflow'
import Modal from '@/components/modal/Modal'
import { getIncomingEdges, getOutgoingEdges } from '@/helpers/edgeHelpers'
import { DataEdge } from '@/helpers/classes/DataEdge'
import { BooleanField } from '@/components/FieldComponents/BooleanField'
import { NumberField } from '@/components/FieldComponents/NumberField'
import { StringField } from '@/components/FieldComponents/StringField'
import { getCount } from '@/helpers/getCount'
import { ButtonRow } from '@/helpers/styles'
import { Field } from '@/helpers/types'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'
import Divider from '@/components/Divider'
import ColorInput from '@/components/ColorInput'
import { BasicNode } from '@/helpers/classes/BasicNode'
import IconButton from '@/components/Button/IconButton'
import LockIcon from '@/components/Icons/Lock'
import UnlockIcon from '@/components/Icons/Unlock'
import { Paragraph } from '@/components/Typography/text'
import { Container, DataContainer } from './styles'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
}> = ({ close, isOpen }) => {
	const reactFlowInstance = useReactFlow()

	const {
		nodes,
		edges,
		editNodeID,
		dispatch,
		updateDialogueData,
		updateNodeColor,
	} = useStore()

	if (!editNodeID) return null

	const editNode = nodes.find((n) => n.id === editNodeID) as BasicNode

	const edgesOut = getOutgoingEdges(editNodeID, edges)
	const edgesIn = getIncomingEdges(editNodeID, edges)

	const naturalOutgoingEdges = edgesOut.filter(
		(e) => e.sourceHandle === null || e.sourceHandle === e.source
	)

	const dataNodeEdges = edgesOut.filter(
		(e) => e.sourceHandle !== e.source && e.sourceHandle !== null
	)

	const [name, setName] = useState(editNode ? editNode.data.name || '' : '')
	// const [color, setColor] = useState(editNode.data.color)
	const [id, setID] = useState(editNodeID || '')
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
		setID(editNodeID)
		setName(editNode ? editNode.data.name : '')
		setFields(editNode ? editNode.data.fields || [] : [])
		setCount(fields.length)
	}, [editNodeID])

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

				if (idCheck === 1 && id !== editNodeID) {
					/* vendors contains the element we're looking for */
					setIDError(true)
					console.log('node ID conflict')
				} else {
					dispatch({
						type: types.editNode,
						data: { editNodeID, nodeData },
					})
					// updateDialogueData(editNodeID, dialogue)
					close()
				}
			}}
		>
			<FlexRow style={{ height: '80vh' }}>
				<FlexColumn style={{ flex: 1, alignItems: 'center' }}>
					INCOMING
					<Divider />
					{edgesIn.map((e) => {
						return (
							<Button
								key={e.id}
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
						style={{
							gap: 32,
							justifyContent: 'space-between',
							width: '100%',
						}}
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
					<FlexRow
						style={{
							gap: '32px',
							border: IDError ? '1px solid red' : '',
						}}
					>
						{IDError && (
							<p style={{ color: 'red' }}>
								A node with ID: {editNodeID} already exists
							</p>
						)}
						<input
							disabled={lockID}
							value={id}
							onChange={(e) => setID(e.target.value)}
						/>
						<IconButton
							background="black"
							color="white"
							radius="3px"
							Icon={lockID ? UnlockIcon : LockIcon}
							onClick={() => setLockID(!lockID)}
						/>
					</FlexRow>
					<ButtonRow style={{ width: '100%' }}>
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
					<DataContainer>
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
										<FlexColumn
											style={{
												minHeight: 64,
												width: '80%',
											}}
										>
											<Paragraph
												style={{
													textAlign: 'center',
													color: 'white',
												}}
											>
												{field.key}:
											</Paragraph>
											<textarea
												style={{ maxWidth: '100%' }}
											/>
											<Button
												danger
												onClick={() =>
													deleteField(field.key)
												}
											>
												Delete
											</Button>
										</FlexColumn>
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
											{field.key}:
											<Button
												onClick={() => {
													const newNode =
														new BasicNode(
															'basic',
															editNode.position
																.x + 300,
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
													const targeteditNodeID =
														edgesOut.filter(
															(e) =>
																e.sourceHandle ===
																field.key
														)[0]?.target

													dispatch({
														type: types.setNode,
														data: targeteditNodeID,
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
					</DataContainer>
				</Container>
				<FlexColumn style={{ flex: 1, alignItems: 'center' }}>
					OUTGOING
					<Divider />
					Next:
					{naturalOutgoingEdges.map((e) => {
						return (
							<Button
								key={e.id}
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
								key={e.id}
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
