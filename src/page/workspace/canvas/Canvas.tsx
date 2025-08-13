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
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { ControlsStyled, MiniMapStyled, ReactFlowStyled } from '@/helpers/theme'
import { NodeTypes, EdgeTypes, Schema } from '@/helpers/types'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { splitEdge } from '@/helpers/edgeHelpers'
import useIsTabActive from '@/helpers/hooks/useIsTabActive'
import BasicNodeDetail from '../../detail/BasicNodeDetail'
import EdgeDetail from '../../detail/EdgeDetail'
import { CanvasContainer } from './styles'
import { BottomBar } from '../styles'
import SaveModal from './SaveModal'
import { useCanvasHandlers } from '../../../helpers/canvasHandlers/canvasHandlers'
import { useContextMenuHandlers } from '../../../helpers/canvasHandlers/contextMenuHandlers'

type Props = {
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
}

const Canvas: React.FC<Props> = ({
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

	const reactFlowInstance = useReactFlow()
	const reactFlowWrapper = useRef<any>(null)

	const forbiddenList = [
		...workspace.schemas.map((s) => s.name),
		...custom.map((s) => s.name),
	]

	const displayName = schema ? schema.name.replace('@workspace/', '') : ''
	const schemaColor = schema ? schema.color : ''

	const dispatch = useStore((store) => store.dispatch)

	// ================= CONNECTION BEHAVIOR ================================

	// useState gives us an old refernce inside of the useCallback
	// but not inside of useEffect, so we use this hack to get the correct
	// connection attempt
	const [connectionAttempt, setConnectionAttempt] =
		useState<OnConnectStartParams | null>(null)
	const connection = useRef(connectionAttempt)

	// Close the context menu if it's open whenever the window is clicked.
	const onPaneClick = useCallback(() => {
		setSelectedNodes([])
		setContextMenuData(null)
	}, [setContextMenuData, setSelectedNodes])

	function closeModal() {
		dispatch({ type: types.setSaveNodes, data: null })
		onPaneClick()
	}

	const {
		onCustomConnect,
		onConnectStart,
		onConnectEnd,
		onDragOver,
		onDrop,
	} = useCanvasHandlers({
		onConnect,
		addNode,
		reactFlowInstance,
		connectionAttemptRef: connection,
		setConnectionAttempt,
		reactFlowWrapperRef: reactFlowWrapper,
		nodes,
		edges,
	})

	const {
		contextMenuRef,
		onNodeContextMenu,
		onSelectionContextMenu,
		onPaneCanvasContextMenu,
	} = useContextMenuHandlers({ setContextMenuData, setSelectedNodes })

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

	useEffect(() => {
		fitView()
	}, [activeScene])

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
					onConnect={onCustomConnect}
					onConnectStart={onConnectStart}
					onConnectEnd={onConnectEnd}
					onDragOver={onDragOver}
					onDrop={onDrop}
					deleteKeyCode="Delete"
					multiSelectionKeyCode="Control"
					snapToGrid
					snapGrid={[15, 15]}
					style={{ height: '100%', width: '100%', zIndex: 0 }}
					edgeUpdaterRadius={10}
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
						size={2}
						variant={BackgroundVariant.Dots}
					/>
				</ReactFlowStyled>
			</div>
			<BottomBar>
				{(showSGButton || mode === 'customize') && (
					<button
						className="btn-secondary"
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
					</button>
				)}
				{mode === 'customize' && (
					<button
						className="btn-alert"
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
					</button>
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
