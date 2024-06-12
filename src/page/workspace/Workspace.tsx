import React, { useEffect, useState } from 'react'
import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
} from 'reactflow'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import CreateScene from '@/components/forms/scene/CreateScene'
import EditScene from '@/components/forms/scene/EditScene'
import Modal from '@/components/modal/Modal'
import DeleteScene from '@/components/forms/scene/DeleteScene'
import Button from '@/components/Button/Button'
import { Paragraph } from '@/components/Typography/text'
import Canvas from './canvas/Canvas'
import NodeGroup from './palette/NodeGroup'
import Palette from './palette/Palette'
import { TabLink, WorkspaceContainer } from './styles'
import SceneGroup from './palette/SceneGroup'

const Workspace: React.FC<{}> = (props) => {
	const {
		builtInNodes: builtIn,
		customNodes: custom,
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		addNode,
		setEdges,
		setNodes,
		workspace,
		mode,
		schema,
		activeScene,
		dispatch,
	} = useStore()

	const workspaceScenes = Object.keys(workspace.scenes)

	const [paletteMode, setPaletteMode] = useState<'nodes' | 'scenes'>('nodes')
	const [formMode, setFormMode] = useState('')

	const [customizerNodes, setCustomizerNodes] = useState<Node<any>[]>([])
	const [customizerEdges, setCustomizerEdges] = useState<Edge<any>[]>([])

	const onCustomizerConnect = (connection: Connection | Edge) => {
		setCustomizerEdges(addEdge(connection, customizerEdges))
	}
	const addCustomizerNode = (newNode: Node<any>) => {
		setCustomizerNodes([...customizerNodes, newNode])
	}
	const onCustomizerNodesChange = (changes: NodeChange[]) => {
		setCustomizerNodes(applyNodeChanges(changes, customizerNodes))
	}
	const onCustomizerEdgesChange = (changes: EdgeChange[]) => {
		setCustomizerEdges(applyEdgeChanges(changes, customizerEdges))
	}

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
						forbidden={workspaceScenes}
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
					<Paragraph style={{ padding: '8px 0px' }} color="whtie">
						Workspace: {workspace.name ? workspace.name : 'NONE'}
					</Paragraph>
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
					{/* nodes/scenes container */}
					<div style={{ padding: 20 }}>
						{paletteMode === 'nodes' && (
							<>
								<div className="description">
									You can drag these nodes to the pane on the
									right.
								</div>
								<Button
									type="secondary"
									onClick={() => {
										dispatch({
											type: types.customizeSchema,
											data: {
												mode: 'customize',
												schema: null,
											},
										})
									}}
									block
								>
									Create Node
								</Button>
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
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: 8,
								}}
							>
								<Button
									type="secondary"
									onClick={() => setFormMode('createScene')}
								>
									New Scene
								</Button>
								<SceneGroup
									data={workspaceScenes}
									activeScene={activeScene}
									onEdit={setFormMode}
								/>
							</div>
						)}
					</div>
				</Palette>
				{/* Find a way to merge these two into one */}
				{mode !== 'customize' && (
					<Canvas
						nodes={nodes}
						edges={edges}
						onNodesChange={onNodesChange}
						onEdgesChange={onEdgesChange}
						onConnect={onConnect}
						addNode={addNode}
						setEdges={setEdges}
						setNodes={setNodes}
					/>
				)}
				{mode === 'customize' && (
					<Canvas
						schemaName={schema}
						nodes={customizerNodes}
						edges={customizerEdges}
						onNodesChange={onCustomizerNodesChange}
						onEdgesChange={onCustomizerEdgesChange}
						onConnect={onCustomizerConnect}
						addNode={addCustomizerNode}
						setEdges={setCustomizerEdges}
						setNodes={setCustomizerNodes}
						mode={mode}
					/>
				)}
			</WorkspaceContainer>
		</>
	)
}

export default Workspace
