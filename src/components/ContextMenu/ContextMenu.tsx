import React, { useCallback } from 'react'
import { Edge, useReactFlow, useStoreApi } from 'reactflow'
import useStore from '@/store/store'
import { SerializeNode } from '@/helpers/serialization/serialization'
import { getOutgoingEdges } from '@/helpers/edgeHelpers'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'
import { types } from '@/store/reducer'
import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg'
import { ReactComponent as SaveIcon } from '@/assets/icons/save.svg'
import { ReactComponent as DuplicateIcon } from '@/assets/icons/duplicate.svg'
import { ContextButton, ContextMenuContainer } from './styles'
import Divider from '../Divider'
import Button from '../Button/Button'
import { Paragraph } from '../Typography/text'
import { FlexRow } from '../styles'

import IconButton from '../Button/IconButton'

export const ContextMenu: React.FC<{
	ids: string[]
	top: number
	left: number
	right: number
	bottom: number
	onSave: () => void
	close: () => void
}> = ({ ids, top, left, right, bottom, onSave, close, ...props }) => {
	const { nodes, edges, addNode, onConnect, setNodes, dispatch } = useStore()

	const rfStore = useStoreApi()

	const { addSelectedNodes, resetSelectedElements } = rfStore.getState()

	const duplicateNode = useCallback(() => {
		const nds = nodes.filter((n) => ids.includes(n.id))
		if (nds.length === 0) {
			console.log('error finding nodes: ', ids)
		}

		const idMap: {
			[key: string]: number
		} = {} // string and index

		const data = {
			type: 'group',
			name: 'tmp',
			color: 'blue',
			nodes: [],
			edges: [],
		}

		const groupEdges: Edge[] = []

		nds.forEach((n) => {
			const gN = SerializeNode(
				n.data.name,
				n.data.color,
				'base',
				n.data.fields
			)
			const o = {
				...gN,
				position: [n.position.x + 50, n.position.y + 50],
			}

			idMap[n.id] = data.nodes.length
			// @ts-ignore
			data.nodes.push(o)
			groupEdges.push(...getOutgoingEdges(n.id, edges))
		})

		// filter & normalize edges
		groupEdges.forEach((e) => {
			// look into map, if the to and from both exist, use their
			// ids & the to node's key for it
			const from = idMap[e.source]
			// eslint-disable-next-line no-nested-ternary
			const handle = e.sourceHandle
				? e.sourceHandle === e.source
					? ''
					: e.sourceHandle
				: ''
			const to = idMap[e.target]

			if (to !== undefined && from !== undefined) {
				// @ts-ignore
				data.edges.push({ handle, to, from })
			}
		})

		const { newNodes, newEdges } = decodeSchema({ x: 0, y: 0 }, data)

		newNodes.forEach((n) => addNode({ ...n, selected: true }))
		newEdges.forEach((e) => onConnect(e))

		// resetSelectedElements()
		addSelectedNodes(newNodes.map((n) => n.id))
	}, [ids, addNode])

	const deleteNode = useCallback(() => {
		const deletedEdges: Edge<any>[] = []

		ids.forEach((id) => deletedEdges.push(...getOutgoingEdges(id, edges)))

		deletedEdges.forEach((e) =>
			dispatch({ type: types.deleteEdge, data: e.id })
		)

		setNodes(nodes.filter((node) => !ids.includes(node.id)))
		close()
	}, [ids, setNodes])

	return (
		// @ts-ignore
		<ContextMenuContainer style={{ top, left, right, bottom }}>
			<ContextButton>
				<Paragraph>
					node(s):{' '}
					{ids.map((id, index, arr) => (
						<span key={id}>
							[{id}]{index < arr.length - 1 && <>, </>}
						</span>
					))}
				</Paragraph>
				<Divider />
			</ContextButton>
			<FlexRow style={{ justifyContent: 'space-between' }}>
				<FlexRow>
					<IconButton
						fill="white"
						Icon={DuplicateIcon}
						onClick={duplicateNode}
					/>
					<IconButton fill="white" Icon={SaveIcon} onClick={onSave} />
				</FlexRow>
				<IconButton
					fill="white"
					Icon={CloseIcon}
					onClick={deleteNode}
				/>
			</FlexRow>
		</ContextMenuContainer>
	)
}
