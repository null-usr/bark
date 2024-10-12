import EditNode from '@/components/forms/node/EditNode'
import Modal from '@/components/modal/Modal'
import { encodeSchema } from '@/helpers/serialization/encodeSchema'
import { Schema } from '@/helpers/types'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import React from 'react'
import { Edge, Node } from 'reactflow'

const SaveModal: React.FC<{
	displayName?: string | null
	color?: string | null
	schema?: Schema | null
	nodes: Node[]
	edges: Edge[]
	forbiddenList: string[]
	close: () => void
}> = ({ nodes, edges, forbiddenList, displayName, color, schema, close }) => {
	const { mode } = useStore()

	const dispatch = useStore((store) => store.dispatch)
	return (
		<Modal title="Save Node(s)" withDimmer isOpen close={close}>
			<EditNode
				forbidden={forbiddenList}
				cancel={() => {
					dispatch({ type: types.setSaveNodes, data: null })
					close()
				}}
				name={displayName || undefined}
				schema={schema}
				color={color || undefined}
				saveToEditor={schema ? displayName === schema.name : false}
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
						dispatch({
							type: types.customizeSchema,
							data: { mode: 'active', schema: null },
						})
					}

					close()
				}}
			/>
		</Modal>
	)
}

export default SaveModal
