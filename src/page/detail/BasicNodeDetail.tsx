/* eslint-disable max-len */
import React, { useEffect, useState } from 'react'
import { Edge } from 'reactflow'
import EditModal from '@/components/modal/EditModal'
import { getIncomingEdges, getOutgoingEdges } from '@/helpers/edgeHelpers'
import { DataEdge } from '@/helpers/classes/DataEdge'
import { getCount } from '@/helpers/getCount'
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
import { renderField } from '@/components/nodes/BasicNode/renderField'
import AddFields from '@/components/nodes/BasicNode/AddFields'
import { Container, DataContainer, ItemContainer } from './styles'
import DetailDataField from './DetailDataField'

const Detail: React.FC<{
	close: () => void
	isOpen: boolean
}> = ({ close, isOpen }) => {
	const { nodes, edges, editNodeID, workspace, dispatch, updateNodeColor } =
		useStore()

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
		<EditModal
			title="Node Detail"
			isOpen
			close={() => {
				const nodeData = {
					id: lockID ? editNode.id : id,
					name,
					color: editNode.data.color,
					fields,
				}

				dispatch({
					type: types.editNode,
					data: { nodeID: editNodeID, nodeData },
				})
				close()
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
							// gap: '32px',
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
						{!lockID && (
							<>
								<Button
									danger
									onClick={() => {
										const idCheck = getCount(
											nodes,
											'id',
											id
										)

										if (idCheck > 0 && id !== editNodeID) {
											setIDError(true)
										} else {
											dispatch({
												type: types.updateNodeID,
												data: {
													oldID: editNodeID,
													newID: id,
												},
											})
											dispatch({
												type: types.setNode,
												data: id,
											})
											setLockID(true)
											setIDError(false)
										}
									}}
								>
									SAVE
								</Button>
								<Button
									type="secondary"
									onClick={() => {
										setID(id)
										setIDError(false)
										setLockID(true)
									}}
								>
									CANCEL
								</Button>
							</>
						)}
						{lockID && (
							<IconButton
								background="black"
								color="white"
								radius="3px"
								Icon={lockID ? UnlockIcon : LockIcon}
								onClick={() => setLockID(!lockID)}
							/>
						)}
					</FlexRow>
					<AddFields
						addField={addField}
						hasCustomVars={Object.keys(workspace.w_vars).length > 0}
					/>
					<DataContainer>
						{fields.map((field, index) => {
							return (
								<ItemContainer>
									{field.type === 'data' ? (
										<DetailDataField
											key={field.key}
											fieldKey={field.key}
											index={index}
											updateFieldKey={updateKey}
											editNode={editNode}
											edgesOut={edgesOut}
										/>
									) : (
										renderField(
											field,
											index,
											editNode.data.color,
											false,
											editNodeID,
											updateKey,
											deleteField,
											updateValue,
											undefined,
											undefined
										)
									)}
								</ItemContainer>
							)
						})}
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
		</EditModal>
	)
}

export default Detail
