import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import ReactFlow, {
	ReactFlowProvider,
	addEdge,
	MiniMap,
	Controls,
	Background,
	Connection,
	Edge,
	Node,
	OnConnectStartParams,
	Position,
	useNodesState,
	useEdgesState,
	useReactFlow,
	BackgroundVariant,
} from 'reactflow'
import { v4 as uuid } from 'uuid'
import Modal from '@/components/modal/Modal'
import DialogueNodeType, { DialogueNode } from '@/helpers/nodes/DialogueNode'
import BasicNodeType, { BasicNode } from '@/helpers/nodes/BasicNode'
import DataEdge, { DataEdgeType } from '@/helpers/edges/DataEdge'
import RootNodeType from '@/helpers/nodes/RootNode'
import useStore, { RFState, types } from '@/store/store'
import ColorChooserNode from '@/helpers/nodes/ColorChooserNode'
import { encodeSchema } from '@/helpers/serialization/encodeSchema'
import SaveNodeGroupForm from '@/helpers/serialization/SaveNodeGroupForm'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'
import CreateNode from '@/components/forms/node/EditNode'
import BasicNodeDetail from '../../detail/BasicNodeDetail'
import EdgeDetail from '../../detail/EdgeDetail'
import { AddButton, CanvasContainer } from './styles'
import { BottomBar } from '../styles'

const Canvas: React.FC<{}> = (props) => {
	const {
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		addNode,
		setEdges,
		activeScene,
		customNodes: custom,
		workspace,
	} = useStore()
	const { setViewport, fitView } = useReactFlow()

	// for modal
	const [sgModalOpen, setSGModalOpen] = useState(false)
	const [showSGButton, setShowSGButton] = useState(false)

	const [selectedNodes, setSelectedNodes] = useState<Node<any>[]>([])

	const [hoveredEdge, setHoveredEdge] = useState<Edge | null>(null)

	const reactFlowInstance = useReactFlow()

	// call your hook here
	// const forceUpdate = useForceUpdate()

	const nodeID = useStore((state: RFState) => state.nodeID)
	const edgeID = useStore((state: RFState) => state.edgeID)

	const forbiddenList = [
		...workspace.schemas.map((s) => s.name),
		...custom.map((s) => s.name),
	]

	// zustand store
	const dispatch = useStore((store: RFState) => store.dispatch)

	const edgeTypes = useMemo(
		() => ({
			data: DataEdgeType,
		}),
		[]
	)

	const nodeTypes = useMemo(
		() => ({
			base: BasicNodeType,
			root: RootNodeType,
			dialogue: DialogueNodeType,
			colorChooser: ColorChooserNode,
		}),
		[]
	)

	function closeModal() {
		setSGModalOpen(false)
	}

	const reactFlowWrapper = useRef<any>(null)

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
		[reactFlowInstance, connectionAttempt]
	)

	const onConnectStart = useCallback(
		(
			event: React.MouseEvent<Element, MouseEvent>,
			params: OnConnectStartParams
		) => {
			if (event.button !== 2 && params.handleType === 'source') {
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
			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const newNode = {
				id: uuid(),
				type: 'default',
				position,
				data: { label: `default node` },
				sourcePosition: Position.Right,
				targetPosition: Position.Left,
			}

			const edge: Edge = new DataEdge(
				connection.current!.nodeId!,
				newNode.id,
				connection.current!.handleId,
				null
			)
			addNode(newNode)
			reactFlowInstance.setEdges((els: any) => addEdge(edge, els))
			setConnectionAttempt(null)
		},
		[reactFlowInstance, connectionAttempt]
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

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})

			const { newNodes, newEdges } = decodeSchema(position, paletteItem)

			newNodes.forEach((n) => addNode(n))
			newEdges.forEach((e) => onConnect(e))

			// addNode(newNode)
		},
		[reactFlowInstance]
	)

	return (
		<CanvasContainer>
			<Modal withDimmer open={sgModalOpen} close={closeModal}>
				<CreateNode
					forbidden={forbiddenList}
					cancel={() => setSGModalOpen(false)}
					submit={(name, color, saveToEditor) => {
						const data = encodeSchema(
							name,
							color,
							selectedNodes,
							edges
						)
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

						setSGModalOpen(false)
					}}
				/>
				<button onClick={closeModal}>Cancel</button>
			</Modal>
			<div
				style={{ width: '100%', height: '100%', position: 'relative' }}
				className="reactflow-wrapper"
				ref={reactFlowWrapper}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					edgeTypes={edgeTypes}
					nodeTypes={nodeTypes}
					// onSelectionContextMenu={saveGroup}
					// looks like this is the only one that works
					onSelectionChange={(params) => {
						setSelectedNodes(params.nodes)
						if (params.nodes.length > 1 && !showSGButton) {
							setShowSGButton(true)
						} else if (params.nodes.length < 1) {
							setShowSGButton(false)
						}
					}}
					// onSelectionDragStop={(e: React.MouseEvent, nds: Node[]) => {
					// 	console.log('pong')
					// }}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					// drag currently doesn't do the callback when a group is dragged
					// onNodeDragStart={(e, n, nds) => {}}
					// onNodeDragStop={(e, n, nds) => {
					// 	console.log(nds)
					// 	console.log(hoveredEdge)
					// }}
					// onConnect={onConnect}
					onConnect={onCustomConnect}
					// @ts-ignore
					onConnectStart={onConnectStart}
					// @ts-ignore
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
				>
					<MiniMap
						nodeStrokeColor={(n) => {
							if (n.style?.background)
								return n.style.background as string
							if (n.type === 'input') return '#0041d0'
							if (n.type === 'output') return '#ff0072'
							if (n.type === 'default') return '#1a192b'

							return '#1a192b'
						}}
						nodeColor={(n) => {
							if (n.style?.background)
								return n.style.background as string

							if (n.type === 'base')
								return n.data.color ? n.data.color : '#1a192b'

							return '#fff'
						}}
						nodeBorderRadius={2}
						zoomable
						pannable
					/>
					<Controls />
					<Background
						color="#c0adf0"
						gap={16}
						size={3}
						variant={BackgroundVariant.Cross}
					/>
				</ReactFlow>
			</div>
			<BottomBar>
				{showSGButton && (
					<button onClick={() => setSGModalOpen(true)}>
						Save Group
					</button>
				)}
			</BottomBar>
			{nodeID && (
				<BasicNodeDetail
					isOpen
					close={() => dispatch({ type: types.setNode, data: null })}
				/>
			)}
			{edgeID && (
				<EdgeDetail
					edgeID={edgeID}
					isOpen
					close={() => dispatch({ type: types.setEdge, data: null })}
				/>
			)}
		</CanvasContainer>
	)
}

export default Canvas
