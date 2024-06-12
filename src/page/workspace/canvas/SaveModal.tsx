import EditNode from '@/components/forms/node/EditNode'
import Modal from '@/components/modal/Modal'
import { encodeSchema } from '@/helpers/serialization/encodeSchema'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import React from 'react'
import { Edge, Node } from 'reactflow'

const SaveModal: React.FC<{
	name?: string | null
	color?: string | null
	schemaName?: string | null
	nodes: Node[]
	edges: Edge[]
	forbiddenList: string[]
	close: () => void
}> = ({ nodes, edges, forbiddenList, name, color, schemaName, close }) => {
	const { mode } = useStore()

	const dispatch = useStore((store) => store.dispatch)
	return (
		<Modal withDimmer open close={close}>
			<EditNode
				forbidden={forbiddenList}
				cancel={() => {
					dispatch({ type: types.setSaveNodes, data: null })
					close()
				}}
				name={name || undefined}
				color={color || undefined}
				saveToEditor={schemaName ? name === schemaName : false}
				submit={(
					newName: string,
					newColor: string,
					saveToEditor: boolean
				) => {
					const data = encodeSchema(newName, newColor, nodes, edges)
					if (saveToEditor) {
						dispatch({
							type: types.addCustomNode,
							data,
						})
					} else {
						dispatch({
							type: types.addCustomWorkspaceNode,
							data: {
								...data,
								name: `@workspace/${data.name}`,
							},
						})
					}

					// if we're in edit mode we need to get out of here
					if (mode === 'customize') {
						// setNodes([])
						// setEdges([])
						dispatch({
							type: types.customizeSchema,
							data: { mode: 'active', schema: null },
						})
					}

					close()
					// onPaneClick()
				}}
			/>
		</Modal>
	)
}

export default SaveModal
