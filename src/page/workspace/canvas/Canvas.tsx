/* eslint-disable max-len */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
	Background,
	Connection,
	Edge,
	Node,
	OnConnectStartParams,
	useReactFlow,
	BackgroundVariant,
	NodeChange,
	EdgeChange,
} from 'reactflow'
import { DataEdge } from '@/helpers/classes/DataEdge'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'
import { ControlsStyled, MiniMapStyled, ReactFlowStyled } from '@/helpers/theme'
import { NodeTypes, EdgeTypes, Schema } from '@/helpers/types'
import Button from '@/components/Button/Button'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { splitEdge } from '@/helpers/edgeHelpers'
import { BasicNode } from '@/helpers/classes/BasicNode'
import useIsTabActive from '@/helpers/hooks/useIsTabActive'
import BasicNodeDetail from '../../detail/BasicNodeDetail'
import EdgeDetail from '../../detail/EdgeDetail'
import { CanvasContainer } from './styles'
import { BottomBar } from '../styles'
import SaveModal from './SaveModal'

const Canvas: React.FC<{
	schema?: Schema | null
	nodes: Node<any>[]
	edges: Edge<any>[]
	onNodesChange: (changes: NodeChange[]) => void
	onEdgesChange: (changes: EdgeChange[]) => void
	onConnect: (connection: Connection | Edge) => void
	addNode: (newNode: Node<any>) => void
	setEdges: (edges: Edge<any>[]) => void
	setNodes: (nodes: Node<any>[]) => void
	mode?: string
}> = ({
	schema,
	nodes,
	edges,
	onNodesChange,
	onEdgesChange,
	onConnect,
	addNode,
	setEdges,
	setNodes,
	mode,
}) => {
	const {
		activeScene,
		customNodes: custom,
		workspace,
		editEdgeID,
		editNodeID,
		saveNodes,
	} = useStore()
	const { fitView } = useReactFlow()

	const tabActive = useIsTabActive()

	const [showSGButton, setShowSGButton] = useState(false)
	const [selectedNodes, setSelectedNodes] = useState<Node<any>[]>([])
	const [hoveredEdge, setHoveredEdge] = useState<Edge | null>(null)

	const [contextMenuData, setContextMenuData] = useState<any>(null)
	const contextMenuRef = useRef(null)

	const reactFlowInstance = useReactFlow()
	const reactFlowWrapper = useRef<any>(null)

	const forbiddenList = [
		...workspace.schemas.map((s) => s.name),
		...custom.map((s) => s.name),
	]

	const displayName = schema ? schema.name.replace('@workspace/', '') : ''
	const schemaColor = schema ? schema.color : ''

	const dispatch = useStore((store) => store.dispatch)

	useEffect(() => {
		fitView()
	}, [activeScene])

	// ================= CONNECTION BEHAVIOR ================================

	// useState gives us an old refernce inside of the useCallback
	// but not inside of useEffect, so we use this hack to get the correct
	// connection attempt
	const [connectionAttempt, setConnectionAttempt] =
		useState<OnConnectStartParams | null>(null)
	const connection = useRef(connectionAttempt)

	useEffect(() => {
		connection.current = connectionAttempt
	}, [connectionAttempt])

	useEffect(() => {
		if (!tabActive && mode !== 'customize') {
			dispatch({
				type: types.saveScene,
				data: undefined,
			})
		}
	}, [tabActive])

	const onCustomConnect = useCallback(
		(params: Connection) => {
			setConnectionAttempt(null)
			if (params.sourceHandle) {
				const edge: Edge = new DataEdge(
					params.source!,
					params.target!,
					connection.current!.handleId,
					null
				)
				onConnect(edge)
			} else {
				onConnect({ ...params, type: 'step' })
			}
		},
		[reactFlowInstance, connectionAttempt, edges]
	)

	const onConnectStart = useCallback(
		(
			event: React.MouseEvent<Element, MouseEvent>,
			params: OnConnectStartParams
		) => {
			if (event.button !== 2) {
				setConnectionAttempt(params)
			}
		},
		[connectionAttempt]
	)

	// we've dragged a handle into an empty spot
	const onConnectEnd = useCallback(
		(event: React.MouseEvent<Element, MouseEvent>) => {
			if (!connection.current) {
				return
			}

			event.preventDefault()

			const reactFlowBounds =
				reactFlowWrapper.current.getBoundingClientRect()
			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const newNode = new BasicNode('BASE', position.x, position.y)

			let edge: Edge

			if (connection.current.handleType === 'source') {
				edge = new DataEdge(
					connection.current!.nodeId!,
					newNode.id,
					connection.current!.handleId,
					null
				)
			} else {
				edge = new DataEdge(
					newNode.id,
					connection.current!.nodeId!,
					null,
					null
				)
			}

			addNode(newNode)
			// setEdges((els: any) => addEdge(edge, els))
			onConnect(edge)
			setConnectionAttempt(null)
		},
		[reactFlowInstance, connectionAttempt, nodes, edges]
	)

	// ====================== DRAG & DROP BEHAVIOUR ===========================
	const onDragOver = useCallback(
		(event: {
			preventDefault: () => void
			dataTransfer: { dropEffect: string }
		}) => {
			event.preventDefault()
			event.dataTransfer.dropEffect = 'move'
		},
		[]
	)

	const onDrop = useCallback(
		(event: {
			preventDefault: () => void
			dataTransfer: { getData: (arg0: string) => any }
			clientX: number
			clientY: number
		}) => {
			event.preventDefault()

			const reactFlowBounds =
				reactFlowWrapper.current.getBoundingClientRect()

			const data = event.dataTransfer.getData('application/reactflow')

			const paletteItem = JSON.parse(data)

			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})

			const { newNodes, newEdges } = decodeSchema(position, paletteItem)

			newNodes.forEach((n) => addNode(n))
			newEdges.forEach((e) => onConnect(e))

			// addNode(newNode)
		},
		[reactFlowInstance, nodes]
	)

	const onNodeContextMenu = useCallback(
		(event, n) => {
			// Prevent native context menu from showing
			event.preventDefault()

			// Calculate position of the context menu. We want to make sure it
			// doesn't get positioned off-screen.
			// @ts-ignore
			const pane = contextMenuRef.current!.getBoundingClientRect()
			setContextMenuData({
				contextNodes: [n],
				x: n.position.x + 30,
				y: n.position.y + 30,
				top:
					event.clientY + 200 < pane.height
						? event.clientY
						: event.clientY - 200,
				left:
					event.clientX + 200 < pane.width
						? event.clientX
						: event.clientX - 200,
			})
		},
		[setContextMenuData]
	)

	const onSelectionContextMenu = useCallback(
		(event, nds) => {
			// Prevent native context menu from showing
			event.preventDefault()

			// Calculate position of the context menu. We want to make sure it
			// doesn't get positioned off-screen.
			// @ts-ignore
			const pane = contextMenuRef.current!.getBoundingClientRect()

			setContextMenuData({
				x: nds[0].position.x + 100,
				y: nds[0].position.y + 100,
				// @ts-ignore
				contextNodes: nds,
				top: event.clientY + 200 < pane.height && event.clientY,
				left: event.clientX + 200 < pane.width && event.clientX,
				right:
					event.clientX + 200 >= pane.width &&
					pane.width - event.clientX,
				bottom:
					event.clientY + 200 >= pane.height &&
					pane.height - event.clientY,
			})
		},
		[setContextMenuData, setSelectedNodes]
	)

	const onPaneCanvasContextMenu = useCallback(
		(event) => {
			// Prevent native context menu from showing
			event.preventDefault()

			// Calculate position of the context menu. We want to make sure it
			// doesn't get positioned off-screen.
			// @ts-ignore
			const pane = contextMenuRef.current!.getBoundingClientRect()

			setContextMenuData(null)
		},
		[setContextMenuData]
	)

	// Close the context menu if it's open whenever the window is clicked.
	const onPaneClick = useCallback(() => {
		setSelectedNodes([])
		setContextMenuData(null)
	}, [setContextMenuData, setSelectedNodes])

	function closeModal() {
		dispatch({ type: types.setSaveNodes, data: null })
		onPaneClick()
	}

	return (
		<CanvasContainer>
			{saveNodes && (
				<SaveModal
					displayName={displayName}
					color={schemaColor}
					schema={schema}
					nodes={
						mode === 'customize'
							? nodes
							: saveNodes || selectedNodes
					}
					edges={edges}
					close={closeModal}
					forbiddenList={forbiddenList}
				/>
			)}
			{contextMenuData && (
				<ContextMenu
					close={onPaneClick}
					onSave={() => {
						console.log(contextMenuData)
						dispatch({
							type: types.setSaveNodes,
							data: contextMenuData.contextNodes,
						})
					}}
					// @ts-ignore
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...contextMenuData}
				/>
			)}

			<div
				style={{ width: '100%', height: '100%', position: 'relative' }}
				className="reactflow-wrapper"
				ref={reactFlowWrapper}
			>
				{/* @ts-ignore */}
				<ReactFlowStyled
					ref={contextMenuRef}
					// panOnDrag={false}
					// selectionOnDrag
					nodes={nodes}
					edges={edges}
					edgeTypes={EdgeTypes}
					nodeTypes={NodeTypes}
					// onSelectionContextMenu={saveGroup}
					onSelectionChange={(params) => {
						setSelectedNodes(params.nodes)
						if (params.nodes.length > 1 && !showSGButton) {
							setShowSGButton(true)
						} else if (params.nodes.length < 1) {
							setShowSGButton(false)
						}
					}}
					onNodeDragStart={(eevent, nd, nds) => {}}
					onNodeDragStop={(e, nd, nds) => {
						if (nds.length > 1 || hoveredEdge === null) {
							return
						}

						if (
							hoveredEdge.source === nd.id ||
							hoveredEdge.target === nd.id
						) {
							return
						}

						const newEdges = splitEdge(hoveredEdge, nd)
						onConnect(newEdges[0])
						onConnect(newEdges[1])
						dispatch({
							type: types.deleteEdge,
							data: hoveredEdge.id,
						})
					}}
					onNodesChange={onNodesChange}
					onEdgesChange={(eds) => {
						// bug that if you delete the hovered edge
						// it still 'exists' in the hoveredEdge variable
						setHoveredEdge(null)
						onEdgesChange(eds)
					}}
					// drag currently doesn't do the callback when a group is dragged
					// onNodeDragStart={(e, n, nds) => {}}
					// onNodeDragStop={(e, n, nds) => {}}
					// onConnect={onConnect}
					onConnect={onCustomConnect}
					onConnectStart={onConnectStart}
					onConnectEnd={onConnectEnd}
					// onInit={onInit}
					onDragOver={onDragOver}
					onDrop={onDrop}
					deleteKeyCode="Delete"
					multiSelectionKeyCode="Control"
					snapToGrid
					snapGrid={[15, 15]}
					style={{ height: '100%', width: '100%', zIndex: 0 }}
					edgeUpdaterRadius={10} // maybe increase when dragging
					elevateEdgesOnSelect
					fitView
					// onEdgeContextMenu={}
					onEdgeMouseEnter={(event, edge) => {
						setHoveredEdge(edge)
					}}
					onEdgeMouseLeave={(event, edge) => {
						setHoveredEdge(null)
					}}
					onNodeContextMenu={onNodeContextMenu}
					onSelectionContextMenu={onSelectionContextMenu}
					onPaneContextMenu={onPaneCanvasContextMenu}
					onPaneClick={() => {
						onPaneClick()
					}}
					edgesFocusable
					attributionPosition="top-right"
					// onEdgeContextMenu={}
				>
					<MiniMapStyled
						nodeStrokeColor={(n) => {
							if (n.data.color) return n.data.color

							return '#1a192b'
						}}
						nodeColor={(n) => {
							// if (n.style?.background)
							// 	return n.style.background as string

							if (n.data.color) return n.data.color

							return '#fff'
						}}
						nodeBorderRadius={2}
						zoomable
						pannable
					/>
					<ControlsStyled />
					<Background
						color="#c0adf030"
						gap={16}
						size={3}
						variant={BackgroundVariant.Cross}
					/>
				</ReactFlowStyled>
			</div>
			<BottomBar>
				{(showSGButton || mode === 'customize') && (
					<Button
						type="secondary"
						onClick={() => {
							dispatch({
								type: types.setSaveNodes,
								data:
									mode === 'customize'
										? nodes
										: selectedNodes,
							})
						}}
					>
						Save Group
					</Button>
				)}
				{mode === 'customize' && (
					<Button
						danger
						onClick={() => {
							setNodes([])
							setEdges([])
							dispatch({
								type: types.customizeSchema,
								data: { mode: 'active', schema: null },
							})
						}}
					>
						Exit
					</Button>
				)}
			</BottomBar>
			{editNodeID && (
				<BasicNodeDetail
					isOpen
					close={() => dispatch({ type: types.setNode, data: null })}
				/>
			)}
			{editEdgeID && (
				<EdgeDetail
					edgeID={editEdgeID}
					isOpen
					close={() => dispatch({ type: types.setEdge, data: null })}
				/>
			)}
		</CanvasContainer>
	)
}

export default Canvas
