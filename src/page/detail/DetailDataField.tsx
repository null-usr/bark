import { FlexRow } from '@/components/styles'
import { BasicNode } from '@/helpers/classes/BasicNode'
import { DataEdge } from '@/helpers/classes/DataEdge'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import React, { useState } from 'react'
import { Edge, Node } from 'reactflow'

const DetailDataField: React.FC<{
	fieldKey: string
	index: number
	editNode: Node<any>
	edgesOut: Edge[]
	updateFieldKey: (index: number, k: string) => void
}> = ({ fieldKey, editNode, edgesOut, index, updateFieldKey }) => {
	const { dispatch } = useStore()
	const [newKey, setNewKey] = useState(fieldKey)
	return (
		<FlexRow>
			<input
				type="text"
				value={newKey}
				onChange={(e) => {
					setNewKey(e.target.value)
				}}
				onSubmit={() => updateFieldKey(index, newKey)}
			/>
			{newKey !== fieldKey && (
				<button className="btn-primary" onClick={() => updateFieldKey(index, newKey)}>
					Update Key
				</button>
			)}
			:
			<button className="btn-primary"
				onClick={() => {
					const newNode = new BasicNode(
						'basic',
						editNode.position.x + 300,
						editNode.position.y
					)
					const newEdge: Edge = new DataEdge(
						editNode.id,
						newNode.id,
						fieldKey,
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
			</button>
			<button className="btn-primary"
				disabled={
					edgesOut.filter((e) => e.sourceHandle === fieldKey)
						.length === 0
				}
				onClick={() => {
					const targeteditNodeID = edgesOut.filter(
						(e) => e.sourceHandle === fieldKey
					)[0]?.target

					dispatch({
						type: types.setNode,
						data: targeteditNodeID,
					})
				}}
			>
				Go
			</button>
		</FlexRow>
	)
}

export default DetailDataField
