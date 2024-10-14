import React, { useCallback } from 'react'
import { Edge, useReactFlow, useStoreApi } from 'reactflow'
import useStore from '@/store/store'
// import { SerializeNode } from '@/helpers/serialization/serialization'
import { getOutgoingEdges } from '@/helpers/edgeHelpers'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'
import { types } from '@/store/reducer'
import { encodeSchema } from '@/helpers/serialization/encodeSchema'
import { ContextButton, ContextMenuContainer } from './styles'
import Divider from '../Divider'
import { Paragraph } from '../Typography/text'
import { FlexRow } from '../styles'

import IconButton from '../Button/IconButton'
// import BookmarkIcon from '../Icons/Bookmark'
import CloseIcon from '../Icons/Close'
import FourSquaresIcon from '../Icons/FourSquares'
import SaveIcon from '../Icons/Save'

export const ContextMenu: React.FC<{
	ids: string[]
	x: number
	y: number
	top: number
	left: number
	right: number
	bottom: number
	onSave: () => void
	close: () => void
}> = ({ ids, x, y, top, left, right, bottom, onSave, close, ...props }) => {
	const { nodes, edges, addNode, onConnect, setNodes, dispatch } = useStore()

	const rfStore = useStoreApi()

	const { addSelectedNodes, resetSelectedElements } = rfStore.getState()

	const duplicateNode = useCallback(() => {
		const nds = nodes.filter((n) => ids.includes(n.id))
		if (nds.length === 0) {
			console.log('error finding nodes: ', ids)
		}

		const tmpSchema = encodeSchema('', '', nds, edges)

		// 0, 0 is top left
		const { newNodes, newEdges } = decodeSchema({ x, y }, tmpSchema)

		newNodes.forEach((n) => addNode({ ...n, selected: true }))
		newEdges.forEach((e) => onConnect(e))

		resetSelectedElements()
		addSelectedNodes(newNodes.map((n) => n.id))
		close()
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
						color="white"
						radius="3px"
						width={32}
						height={32}
						Icon={FourSquaresIcon}
						onClick={duplicateNode}
					/>
					<IconButton
						color="white"
						radius="3px"
						width={32}
						height={32}
						Icon={SaveIcon}
						onClick={onSave}
					/>
				</FlexRow>
				<IconButton
					color="white"
					radius="3px"
					width={32}
					height={32}
					Icon={CloseIcon}
					onClick={deleteNode}
				/>
			</FlexRow>
		</ContextMenuContainer>
	)
}
