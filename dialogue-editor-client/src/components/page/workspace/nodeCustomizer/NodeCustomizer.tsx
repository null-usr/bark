import React, {
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import Modal from 'react-modal'
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
	applyNodeChanges,
	NodeChange,
	EdgeChange,
	applyEdgeChanges,
} from 'reactflow'
import { v4 as uuid } from 'uuid'
import DialogueNodeType, {
	DialogueNode,
} from '../../../../helpers/nodes/DialogueNode'
import { AddButton, CanvasContainer } from './styles'
import BasicNodeType, { BasicNode } from '../../../../helpers/nodes/BasicNode'
import DataEdge, { DataEdgeType } from '../../../../helpers/edges/DataEdge'
import RootNodeType from '../../../../helpers/nodes/RootNode'
import useStore, { RFState, types } from '../../../../store/store'
import ColorChooserNode from '../../../../helpers/nodes/ColorChooserNode'
import EdgeDetail from '../../detail/EdgeDetail'
import BasicNodeDetail from '../../detail/BasicNodeDetail'
import { encodeSchema } from '../../../../helpers/serialization/encodeSchema'
import SaveNodeGroupForm from '../../../../helpers/serialization/SaveNodeGroupForm'
import { decodeSchema } from '../../../../helpers/serialization/decodeSchema'
import { Schema } from '../../../../helpers/types'

// styles for the modal
const customModalStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 1001,
	},
}

const nodeCustomizer: React.FC<{ schemaName?: string | null }> = ({
	schemaName,
}) => {
	let initialNodes: Node<any>[] = []
	let initialEdges: Edge<any>[] = []
	let color
	let displayName = null
	if (schemaName) {
		displayName = schemaName.replace('@workspace/', '')
		// to deal with name overlap, we'll prepend the workspace custom nodes
		// with @workspaceName/nodename
		const custom = useStore((state: RFState) => state.customNodes)
		const { workspace } = useStore()
		const workspaceNodes = workspace.schemas

		const search = [...custom, ...workspaceNodes]

		const s = search.filter((n) => n.name === schemaName)[0]

		const out = decodeSchema({ x: 0, y: 0 }, s)
		color = s.color
		initialEdges = out.newEdges
		initialNodes = out.newNodes
	}
	const [nodes, setNodes] = useState<Node<any>[]>(initialNodes)
	const [edges, setEdges] = useState<Edge<any>[]>(initialEdges)

	const onConnect = (connection: Connection | Edge) => {
		setEdges(addEdge(connection, edges))
	}

	const addNode = (newNode: Node<any>) => {
		setNodes([...nodes, newNode])
	}

	const onNodesChange = (changes: NodeChange[]) => {
		setNodes(applyNodeChanges(changes, nodes))
	}

	const onEdgesChange = (changes: EdgeChange[]) => {
		setEdges(applyEdgeChanges(changes, edges))
	}

	// for modal
	const [sgModalOpen, setSGModalOpen] = useState(false)
	const reactFlowInstance = useReactFlow()

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
		(event: React.MouseEvent, params: OnConnectStartParams) => {
			if (event.button !== 2 && params.handleType === 'source') {
				setConnectionAttempt(params)
			}
		},
		[connectionAttempt]
	)

	// we've dragged a handle into an empty spot
	const onConnectEnd = useCallback(
		(event: MouseEvent) => {
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
		},
		[reactFlowInstance]
	)

	Modal.setAppElement('#root')

	return (
		<CanvasContainer>
			<Modal
				isOpen={sgModalOpen}
				// react/jsx-no-bind, JSX props should not use functions
				onRequestClose={closeModal}
				style={customModalStyles}
				contentLabel="Add Dialogue Option"
			>
				<button onClick={closeModal}>close</button>
				<SaveNodeGroupForm
					name={displayName}
					color={color}
					saveToEditor={displayName === schemaName}
					submit={(name, c, saveEditor) => {
						const data = encodeSchema(name, c, nodes, edges)
						if (saveEditor) {
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
						dispatch({
							type: types.customizeSchema,
							data: { mode: 'active', schema: null },
						})
					}}
				/>
			</Modal>
			<div
				style={{ width: '100%', height: '100%' }}
				className="reactflow-wrapper"
				ref={reactFlowWrapper}
			>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					edgeTypes={edgeTypes}
					nodeTypes={nodeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onNodeDragStart={(e, n, nds) => {}}
					onNodeDragStop={(e, n, nds) => {}}
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
					edgeUpdaterRadius={10}
					elevateEdgesOnSelect
					fitView
					// onEdgeContextMenu={}
					// onEdgeMouseEnter={}
					// onEdgeMouseLeave={}
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
			<AddButton onClick={() => setSGModalOpen(true)}>Save</AddButton>
			<AddButton
				onClick={() => {
					dispatch({
						type: types.customizeSchema,
						data: { mode: '', schema: null },
					})
				}}
			>
				Exit
			</AddButton>
		</CanvasContainer>
	)
}

export default nodeCustomizer
