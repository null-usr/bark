import React, { useEffect, useState } from 'react'
import useStore, { RFState, types } from '@/store/store'
import CreateScene from '@/components/forms/scene/CreateScene'
import EditScene from '@/components/forms/scene/EditScene'
import Modal from '@/components/modal/Modal'
import DeleteScene from '@/components/forms/scene/DeleteScene'
import Canvas from './canvas/Canvas'
import NodeCustomizer from './nodeCustomizer/NodeCustomizer'
import NodeGroup from './palette/NodeGroup'
import Palette from './palette/Palette'
import { TabLink, WorkspaceContainer } from './styles'

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

	const workspaceScenes = Object.keys(workspace.scenes)

	const [paletteMode, setPaletteMode] = useState<'nodes' | 'scenes'>('nodes')
	const [formMode, setFormMode] = useState('')

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
		<>
			{formMode === 'createScene' && (
				<Modal
					open
					withDimmer
					close={() => {
						setFormMode('')
					}}
				>
					<CreateScene
						forbidden={
							workspaceScenes.length > 0
								? workspaceScenes
								: ['default']
						}
						cancel={() => setFormMode('')}
						submit={(name) => {
							dispatch({
								type: types.createScene,
								data: name,
							})
							setFormMode('')
						}}
					/>
				</Modal>
			)}
			{formMode.includes('renameScene') && (
				<Modal
					open
					withDimmer
					close={() => {
						setFormMode('')
					}}
				>
					<EditScene
						forbidden={workspaceScenes}
						cancel={() => setFormMode('')}
						name={formMode.split('-')[1]}
						submit={(name) => {
							dispatch({
								type: types.renameScene,
								data: {
									oldName: formMode.split('-')[1],
									newName: name,
								},
							})
							setFormMode('')
						}}
					/>
				</Modal>
			)}
			{formMode.includes('deleteScene') && (
				<Modal
					open
					withDimmer
					close={() => {
						setFormMode('')
					}}
				>
					<DeleteScene
						submit={() => {
							dispatch({
								type: types.deleteScene,
								data: formMode.split('-')[1],
							})
							setFormMode('')
						}}
						cancel={() => setFormMode('')}
					/>
				</Modal>
			)}
			<WorkspaceContainer>
				<Palette>
					<div style={{ marginBottom: 16 }}>
						<TabLink
							active={paletteMode === 'nodes'}
							onClick={() => setPaletteMode('nodes')}
						>
							Nodes
						</TabLink>
						<TabLink
							active={paletteMode === 'scenes'}
							onClick={() => setPaletteMode('scenes')}
						>
							Scenes
						</TabLink>
					</div>
					{paletteMode === 'nodes' && (
						<>
							<div className="description">
								You can drag these nodes to the pane on the
								right.
							</div>
							<button
								style={{ marginBottom: 8, cursor: 'pointer' }}
								onClick={() => {
									dispatch({
										type: types.customizeSchema,
										data: {
											mode: 'customize',
											schema: null,
										},
									})
								}}
							>
								Create Node
							</button>
							<NodeGroup title="Basic Nodes" data={builtIn} />
							<NodeGroup
								title="Custom Nodes"
								data={custom}
								modable
							/>
							<NodeGroup
								title="Wrokspace Nodes"
								data={workspace.schemas}
								modable
							/>
						</>
					)}
					{paletteMode === 'scenes' && (
						<>
							<button
								style={{ marginBottom: 8, cursor: 'pointer' }}
								onClick={() => setFormMode('createScene')}
							>
								New Scene
							</button>
							{workspaceScenes.map((s) => {
								return (
									// eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
									<div
										key={s}
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
										{activeScene !== s && (
											<>
												<button
													onClick={
														activeScene === s
															? undefined
															: (e) => {
																	e.stopPropagation()
																	setFormMode(
																		`renameScene-${s}`
																	)
															  }
													}
													key={s}
												>
													O
												</button>
												<button
													onClick={
														activeScene === s
															? undefined
															: (e) => {
																	e.stopPropagation()
																	setFormMode(
																		`deleteScene-${s}`
																	)
															  }
													}
													key={s}
												>
													X
												</button>
											</>
										)}
									</div>
								)
							})}
							{Object.keys(workspaceScenes).length === 0 && (
								<>
									<div
										className="node react-flow__node-default"
										style={{
											background: '#ccc',
											cursor: 'not-allowed',
											borderColor: 'black',
										}}
									>
										default
									</div>
								</>
							)}
						</>
					)}
				</Palette>
				{/* Find a way to merge these two into one */}
				{mode !== 'customize' && <Canvas />}
				{mode === 'customize' && <NodeCustomizer schemaName={schema} />}
			</WorkspaceContainer>
		</>
	)
}

export default Workspace
