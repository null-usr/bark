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
import { decodeSchema } from '@/helpers/serialization/decodeSchema'
import { Schema } from '@/helpers/types'
import Canvas from './canvas/Canvas'
import Palette from './palette/Palette'
import { WorkspaceContainer } from './styles'

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
		dispatch,
	} = useStore()

	const workspaceScenes = Object.keys(workspace.scenes)

	const [formMode, setFormMode] = useState('')

	const [customizerNodes, setCustomizerNodes] = useState<Node<any>[]>([])
	const [customizerEdges, setCustomizerEdges] = useState<Edge<any>[]>([])
	const [customizerSchema, setCustomizerSchema] = useState<Schema | null>(
		null
	)

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

	useEffect(() => {
		if (mode !== 'customize') {
			setCustomizerEdges([])
			setCustomizerNodes([])
			setCustomizerSchema(null)
		} else if (mode === 'customize') {
			if (!schema) {
				setCustomizerEdges([])
				setCustomizerNodes([])
				setCustomizerSchema(null)
				return
			}
			const workspaceNodes = workspace.schemas
			const search = [...custom, ...workspaceNodes]
			const s = search.filter((n) => n.name === schema)[0]
			const out = decodeSchema({ x: 0, y: 0 }, s)
			setCustomizerNodes(out.newNodes)
			setCustomizerEdges(out.newEdges)
			setCustomizerSchema(s)
		}
	}, [mode])

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
				<Palette setFormMode={setFormMode} />
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
						schema={customizerSchema}
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
