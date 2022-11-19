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
} from 'react-flow-renderer'
import { v4 as uuid } from 'uuid'
import create from 'zustand'
import DialogueNodeType, {
	DialogueNode,
} from '../../../../helpers/nodes/DialogueNode'
import DialogueForm from '../../../../helpers/DialogueForm'
import { AddButton, CanvasContainer } from './styles'
import BasicNodeType, { BasicNode } from '../../../../helpers/nodes/BasicNode'
import NodeDetail from '../../detail/NodeDetail'
import DataEdge, { DataEdgeType } from '../../../../helpers/edges/DataEdge'
import RootNodeType from '../../../../helpers/nodes/RootNode'
import useStore, { RFState, types } from '../../../../store/store'
import ColorChooserNode from '../../../../helpers/nodes/ColorChooserNode'
import EdgeDetail from '../../detail/EdgeDetail'
import BasicNodeDetail from '../../detail/BasicNodeDetail'
import { SerializeNode } from '../../../../helpers/serialization'
import { getOutgoingEdges } from '../../../../helpers/edgeHelpers'

// styles for the modal
const customModalStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 100,
	},
}

const Canvas: React.FC<{}> = (props) => {
	const {
		nodes,
		edges,
		onNodesChange,
		onEdgesChange,
		onConnect,
		addNode,
		setEdges,
	} = useStore()

	// for modal
	const [modalIsOpen, setIsOpen] = React.useState(false)

	const reactFlowInstance = useReactFlow()

	// call your hook here
	// const forceUpdate = useForceUpdate()

	const nodeID = useStore((state: RFState) => state.nodeID)
	const edgeID = useStore((state: RFState) => state.edgeID)

	// zustand store
	const dispatch = useStore((store: RFState) => store.dispatch)

	const serializeNodeGroup = (groupNodes: Node[]) => {
		// get all outgoing edges
		// filter edges by ids of node in this group
		// the to and from
	}

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

	// on add option click, open the modal
	function addOption(event: any) {
		const newNode = new BasicNode(
			'basic',
			Math.random() * window.innerWidth - 100,
			Math.random() * window.innerHeight
		)
		addNode(newNode)
	}

	function closeModal() {
		setIsOpen(false)
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

	// const onConnectStop = useCallback((event: MouseEvent) => {
	// 	console.log('on connect stop', event)
	// }, [])

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
			const id = uuid()
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

			const { name, type, fields } = paletteItem

			const position = reactFlowInstance.project({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const newNodes: any[] = []
			const newEdges: any[] = []

			console.log(paletteItem)
			switch (type) {
				case 'dialogue':
					newNodes.push(
						new DialogueNode(
							'character name',
							'sample dialogue',
							null,
							position.x,
							position.y
						)
					)
					break
				case 'base':
					newNodes.push(
						new BasicNode(
							name,
							position.x,
							position.y,
							uuid(),
							fields
						)
					)
					break
				case 'custom':
					newNodes.push(
						new BasicNode(name, position.x, position.y, uuid())
					)
					break
				/*
					With group we add the position to the 
				*/
				case 'group':
					// eslint-disable-next-line no-case-declarations
					const { nodes: groupNodes, edges: groupEdges } = paletteItem
					groupNodes.forEach(
						(n: {
							name: string
							type: any
							fields: any
							position: number[]
						}) => {
							switch (n.type) {
								case 'dialogue':
									newNodes.push(
										new DialogueNode(
											'character name',
											'sample dialogue',
											null,
											n.position[0] + position.x,
											n.position[1] + position.y
										)
									)
									break
								case 'base':
									newNodes.push(
										new BasicNode(
											n.name,
											n.position[0] + position.x,
											n.position[1] + position.y,
											uuid(),
											n.fields
										)
									)
									break
								case 'custom':
									newNodes.push(
										new BasicNode(
											n.name,
											n.position[0] + position.x,
											n.position[1] + position.y,
											uuid()
										)
									)
									break
								default:
									newNodes.push({
										id: uuid(),
										type,
										position: {
											x: n.position[0] + position.x,
											y: n.position[1] + position.y,
										},
										data: { label: `${type} node` },
										sourcePosition: Position.Right,
										targetPosition: Position.Left,
									})
									break
							}
						}
					)

					groupEdges.forEach(
						(e: {
							from: number
							to: number
							handle: string | null
						}) => {
							newEdges.push(
								new DataEdge(
									newNodes[e.from].id,
									newNodes[e.to].id,
									e.handle,
									null
								)
							)
						}
					)
					break
				default:
					newNodes.push({
						id: uuid(),
						type,
						position,
						data: { label: `${type} node` },
						sourcePosition: Position.Right,
						targetPosition: Position.Left,
					})
					break
			}
			newNodes.forEach((n) => addNode(n))
			newEdges.forEach((e) => onConnect(e))
			// addNode(newNode)
		},
		[reactFlowInstance]
	)

	const saveGroup = (
		event: React.MouseEvent<Element, MouseEvent>,
		groupNodes: Node<any>[]
	) => {
		event.preventDefault()

		// const orderedNodes = groupNodes.sort((a, b) => {
		// 	if (a.position.x < b.position.x) {
		// 		return -1
		// 	}
		// 	if (b.position.x < a.position.x) {
		// 		return 1
		// 	}
		// 	return 0
		// })

		// const basePosition = orderedNodes[0].position
		const data = {
			type: 'group',
			name: 'sjdfoijwepfef',
			className: 'node react-flow__node-default',
			color: '#FFFFFF',
			nodes: [],
			edges: [],
		}

		const basePosition = groupNodes[0].position
		const idMap: {
			[key: string]: number
		} = {} // string and index
		const groupEdges: Edge[] = []

		// encode nodes w/ base position offset
		groupNodes.forEach((n) => {
			const gN = SerializeNode(
				n.data.name,
				n.data.color,
				'base',
				n.data.fields
			)
			const o = {
				...gN,
				position: [
					n.position.x - basePosition.x,
					n.position.y - basePosition.y,
				],
			}

			idMap[n.id] = data.nodes.length
			// @ts-ignore
			data.nodes.push(o)
			groupEdges.push(...getOutgoingEdges(n.id, edges))
		})

		// filter & normalize edges
		groupEdges.forEach((e) => {
			// look into map, if the to and from both exist, use their
			// ids & the to node's key for it
			const from = idMap[e.source]
			const handle = e.sourceHandle || ''
			const to = idMap[e.target]

			if (to !== undefined && from !== undefined) {
				// @ts-ignore
				data.edges.push({ handle, to, from })
			}
		})

		dispatch({
			type: types.addCustomNode,
			data,
		})
	}

	const submitModal = (event: any) => {
		closeModal()
		if (
			event == null ||
			event.character_name == null ||
			event.character_name === '' ||
			event.dialog == null ||
			event.dialog === ''
		) {
			return
		}

		const newNode = new DialogueNode(
			event.character_name,
			event.dialog,
			null,
			250,
			250
		)
		addNode(newNode)
	}

	Modal.setAppElement('#root')

	return (
		<CanvasContainer>
			<Modal
				isOpen={modalIsOpen}
				// react/jsx-no-bind, JSX props should not use functions
				onRequestClose={closeModal}
				style={customModalStyles}
				contentLabel="Add Dialogue Option"
			>
				<button onClick={closeModal}>close</button>
				<DialogueForm callback={submitModal} />
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
					onSelectionContextMenu={saveGroup}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					// onConnect={onConnect}
					onConnect={onCustomConnect}
					onConnectStart={onConnectStart}
					// onConnectStop={onConnectStop}
					onConnectEnd={onConnectEnd}
					// onInit={onInit}
					onDragOver={onDragOver}
					onDrop={onDrop}
					deleteKeyCode="Delete"
					multiSelectionKeyCode="Control"
					snapToGrid
					snapGrid={[15, 15]}
					style={{ height: '100%', width: '100%', zIndex: 0 }}
					elevateEdgesOnSelect
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

							return '#fff'
						}}
						nodeBorderRadius={2}
					/>
					<Controls />
					<Background color="#aaa" gap={16} />
				</ReactFlow>
			</div>
			<AddButton z={1} onClick={addOption}>
				Add Dialogue Option
			</AddButton>
			<AddButton
				z={1}
				onClick={() => {
					setEdges([])
				}}
			>
				Nuke
			</AddButton>
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
