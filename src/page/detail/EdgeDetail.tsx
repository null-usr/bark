/* eslint-disable max-len */
import EditModal from '@/components/modal/EditModal'
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
import { FlexColumn, FlexRow } from '@/components/styles'
import Divider from '@/components/Divider'
import { CustomField } from '@/components/FieldComponents/CustomField'
import { Container, DataContainer, ItemContainer } from './styles'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
	edgeID: string
}> = ({ close, edgeID, isOpen }) => {
	const reactFlowInstance = useReactFlow()
	const { nodes, dispatch, updateDialogueData } = useStore()

	const editEdge = reactFlowInstance.getEdge(edgeID) as DataEdge
	const [name, setName] = useState(editEdge.data.name)

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
			case 'custom':
				return (
					<CustomField
						index={index}
						key={field.key}
						k={field.key}
						v={field.value}
						updateValue={updateValue!}
						updateKey={updateKey}
						del={deleteField}
						// error={error || false}
					/>
				)
			default:
				return <></>
		}
	}

	if (!editEdge) return null

	return (
		<EditModal
			title="Edge Detail"
			isOpen={isOpen}
			close={() => {
				const edgeData = {
					name,
					edgeID,
					fields,
				}

				dispatch({
					type: types.editEdge,
					data: { edgeID, edgeData },
				})
				close()
			}}
		>
			<FlexRow style={{ height: '80vh' }}>
				<FlexColumn style={{ flex: 1, alignItems: 'center' }}>
					INCOMING NODES
					<Divider />
					{incomingNodes.map((n) => {
						return (
							<button
								className="btn-secondary"
								key={n.id}
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
							</button>
						)
					})}
				</FlexColumn>

				<Container>
					<div style={{ width: '100%' }}>
						<input
							style={{ width: '100%' }}
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<ButtonRow>
						<button
							className="btn-secondary"
							onClick={() => addField('string')}
						>
							Text
						</button>
						<button
							className="btn-secondary"
							onClick={() => addField('bool')}
						>
							Boolean
						</button>
						<button
							className="btn-secondary"
							onClick={() => addField('number')}
						>
							Number
						</button>
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
							<button
								className="btn-secondary"
								key={n.id}
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
							</button>
						)
					})}
				</FlexColumn>
			</FlexRow>
		</EditModal>
	)
}

export default Detail
