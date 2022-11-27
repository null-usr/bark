import React, { useEffect, useState } from 'react'
import useStore, { RFState, types } from '../../../store/store'
import Canvas from './canvas/Canvas'
import NodeCustomizer from './nodeCustomizer/NodeCustomizer'
import NodeGroup from './palette/NodeGroup'
import Palette from './palette/Palette'
import { WorkspaceContainer } from './styles'

const Workspace: React.FC<{}> = (props) => {
	const {
		builtInNodes: builtIn,
		customNodes: custom,
		workspace,
		mode,
		schema,
		activeScene,
		dispatch,
	} = useStore()

	const workspaceNodes = workspace.schemas
	const workspaceScenes = Object.keys(workspace.scenes)

	const [paletteMode, setPaletteMode] = useState<'nodes' | 'scenes'>('nodes')

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
				<div>
					<button onClick={() => setPaletteMode('scenes')}>
						Scenes
					</button>
					<button onClick={() => setPaletteMode('nodes')}>
						Nodes
					</button>
				</div>
				{paletteMode === 'nodes' && (
					<>
						<div className="description">
							You can drag these nodes to the pane on the right.
						</div>
						<NodeGroup title="Basic Nodes" data={builtIn} />
						<NodeGroup title="Custom Nodes" data={custom} modable />
						<NodeGroup
							title="Wrokspace Nodes"
							data={workspaceNodes}
							modable
						/>
					</>
				)}
				{paletteMode === 'scenes' && (
					<>
						<button
							onClick={() => {
								dispatch({
									type: types.createScene,
									data: `${workspaceScenes.length}`,
								})
							}}
						>
							New Scene
						</button>
						{workspaceScenes.map((s) => {
							return (
								// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
								<div
									onClick={
										s === activeScene
											? undefined
											: () => {
													dispatch({
														type: types.changeScene,
														data: s,
													})
											  }
									}
									className="node react-flow__node-default"
									style={{
										cursor: 'pointer',
										borderColor:
											activeScene === s ? 'red' : '',
									}}
								>
									{s}
									<button
										onClick={
											activeScene === s
												? undefined
												: (e) => {
														e.stopPropagation()
														dispatch({
															type: types.deleteScene,
															data: s,
														})
												  }
										}
										key={s}
									>
										X
									</button>
								</div>
							)
						})}
					</>
				)}
			</Palette>
			{mode !== 'customize' && <Canvas />}
			{mode === 'customize' && <NodeCustomizer schemaName={schema} />}
		</WorkspaceContainer>
	)
}

export default Workspace
