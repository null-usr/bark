import React, { useEffect } from 'react'
import useStore, { RFState, types } from '../../../store/store'
import Canvas from './canvas/Canvas'
import NodeCustomizer from './nodeCustomizer/NodeCustomizer'
import NodeGroup from './palette/NodeGroup'
import Palette from './palette/Palette'
import { WorkspaceContainer } from './styles'

const Workspace: React.FC<{}> = (props) => {
	const dispatch = useStore((store: RFState) => store.dispatch)

	const builtIn = useStore((state: RFState) => state.builtInNodes)
	const custom = useStore((state: RFState) => state.customNodes)
	const mode = useStore((state: RFState) => state.mode)
	const schema = useStore((state: RFState) => state.schema)

	useEffect(
		() => {
			async function loadBuiltInNodes() {
				fetch('./builtin.json')
					.then((response) => response.json())
					.then((d) =>
						dispatch({ type: types.loadBuiltInNodes, data: d })
					)
			}

			async function loadCustomNodes() {
				fetch('./custom.json')
					.then((response) => response.json())
					.then((d) =>
						dispatch({ type: types.loadCustomNodes, data: d })
					)
			}

			loadBuiltInNodes()
			loadCustomNodes()
		},
		[
			/* custom */
		]
	)

	return (
		<WorkspaceContainer>
			<Palette>
				<div className="description">
					You can drag these nodes to the pane on the right.
				</div>
				<NodeGroup title="Basic Nodes" data={builtIn} />
				<NodeGroup title="Custom Nodes" data={custom} modable />
				<NodeGroup title="Wrokspace Nodes" data={[]} modable />
			</Palette>
			{mode !== 'customize' && <Canvas />}
			{mode === 'customize' && <NodeCustomizer schemaName={schema} />}
		</WorkspaceContainer>
	)
}

export default Workspace
