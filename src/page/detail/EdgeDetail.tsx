import Modal from '@/components/modal/Modal'
import React, { useState } from 'react'
import { useReactFlow } from 'reactflow'
import { types } from '@/store/reducer'
import { DataEdge } from '@/helpers/classes/DataEdge'
import { BooleanField } from '@/components/FieldComponents/BooleanField'
import { NumberField } from '@/components/FieldComponents/NumberField'
import { StringField } from '@/components/FieldComponents/StringField'
import { ButtonRow } from '@/helpers/styles'
import { Field } from '@/helpers/types'
import useStore from '@/store/store'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'
import Divider from '@/components/Divider'
import { Container, DataContainer, ItemContainer } from './styles'

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
	// const [id, setID] = useState(edgeID || '')

	const incomingNodes = nodes.filter((n) => n.id === editEdge.source)
	const outgoingNodes = nodes.filter((n) => n.id === editEdge.target)

	const [fields, setFields] = useState<Field[]>(editEdge.data.fields || [])
	const [count, setCount] = useState(fields.length)

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

	const renderItem = (field: Field, index: number) => {
		switch (field.type) {
			case 'string':
				return (
					<StringField
						updateKey={updateKey}
						updateValue={updateValue}
						del={deleteField}
						index={index}
						key={field.key}
						k={field.key}
						v={field.value}
						// error={errors[index] || false}
					/>
				)
			case 'bool':
				return (
					<BooleanField
						updateKey={updateKey}
						updateValue={updateValue}
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
						updateKey={updateKey}
						updateValue={updateValue}
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
	}

	if (!editEdge) return null

	return (
		<Modal
			withDimmer
			open={isOpen}
			close={() => {
				const edgeData = {
					name,
					edgeID,
					fields,
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
		>
			<FlexRow style={{ height: '80vh' }}>
				<FlexColumn style={{ flex: 1, alignItems: 'center' }}>
					INCOMING NODES
					<Divider />
					{incomingNodes.map((n) => {
						return (
							<Button
								key={n.id}
								type="secondary"
								onClick={() => {
									dispatch({
										type: types.setNode,
										data: n.id,
									})
									dispatch({
										type: types.setEdge,
										data: null,
									})
								}}
							>
								{n.id}
							</Button>
						)
					})}
				</FlexColumn>

				<Container>
					{/* <input value={id} onChange={(e) => setID(e.target.value)} /> */}
					<div style={{ width: '100%' }}>
						<input
							style={{ width: '100%' }}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<ButtonRow>
						<Button
							type="secondary"
							onClick={() => addField('string')}
						>
							Text
						</Button>
						<Button
							type="secondary"
							onClick={() => addField('bool')}
						>
							Boolean
						</Button>
						<Button
							type="secondary"
							onClick={() => addField('number')}
						>
							Number
						</Button>
					</ButtonRow>
					<DataContainer>
						{fields.map((field, index) => {
							return (
								<ItemContainer>
									{renderItem(field, index)}
								</ItemContainer>
							)
						})}
					</DataContainer>
				</Container>
				<FlexColumn style={{ flex: 1, alignItems: 'center' }}>
					OUTGOING NODES
					<Divider />
					{outgoingNodes.map((n) => {
						return (
							<Button
								key={n.id}
								type="secondary"
								onClick={() => {
									dispatch({
										type: types.setNode,
										data: n.id,
									})
									dispatch({
										type: types.setEdge,
										data: null,
									})
								}}
							>
								{n.id}
							</Button>
						)
					})}
				</FlexColumn>
			</FlexRow>
		</Modal>
	)
}

export default Detail
