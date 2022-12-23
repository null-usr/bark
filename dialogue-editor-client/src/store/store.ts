import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	OnConnect,
	OnEdgesChange,
	OnNodesChange,
	Position,
	useEdges,
} from 'reactflow'
import create from 'zustand'
import initialElements from '../helpers/initial-elements'
import { Schema, Workspace } from '../helpers/types'

export const types = {
	setNode: 'SET_NODE',
	editNode: 'EDIT_NODE',
	addNode: 'ADD_NODE',
	deleteNode: 'DELETE_NODE',
	setNodes: 'SET_NODES',

	customizeSchema: 'CUSTOMIZE',

	setEdge: 'SET_EDGE',
	editEdge: 'EDIT_EDGE',
	addEdge: 'ADD_EDGE',
	deleteEdge: 'DELETE_EDGE',
	updateSourceHandle: 'UPDATE_SOURCE',
	updateTargetHandle: 'UPDATE_SOURCE',

	loadBuiltInNodes: 'DEFAULT',
	loadCustomNodes: 'CUSTOM',
	addCustomNode: 'ADD_CUSTOM',
	deleteCustomNode: 'DELETE_CUSTOM',

	createScene: 'SCENE_CREATE',
	deleteScene: 'SCENE_DELETE',
	renameScene: 'SCENE_RENAME',
	changeScene: 'SCENE_CHANGE',

	createWorkspace: 'WORKSPACE_CREATE',
	loadWorkspace: 'WORKSPACE_LOAD',
	renameWorkspace: 'WORKSPACE_RENAME',
	addCustomWorkspaceNode: 'WORKSPACE_ADD_SCHEMA',
	deleteCustomWorkspaceNode: 'WORKSPACE_DELETE_SCHEMA',
}

export type RFState = {
	nodeID: string | null
	edgeID: string | null

	mode: string
	schema: string | null

	nodes: Node[]
	edges: Edge[]
	builtInNodes: Schema[]
	customNodes: Schema[]

	activeScene: string
	workspace: Workspace

	// Reset
	reset: () => void

	// Nodes
	setNodes: (newNodes: Node[]) => void
	onNodesChange: OnNodesChange
	editNode: (id: string) => void
	addNode: (newNode: Node<any>) => void
	setSelectedNodes: (selected: Node[]) => void
	updateDialogueData: (nodeID: string, d: string) => void
	updateNodeHandles: (
		nodeID: string,
		sources: string[],
		targets: string[]
	) => void

	// Edges
	setEdges: (newEdges: Edge[]) => void
	onEdgesChange: OnEdgesChange
	onConnect: (edge: Edge | Connection) => void
	deleteEdge: (id: string) => void

	// Utility
	dispatch: (args: { type: any; data: any }) => void
	updateNodeColor: (nodeId: string, color: string) => void
	updateNodeName: (nodeId: string, name: string) => void
}

const reducer = (
	state: RFState,
	{ type, data }: { type: string; data: any }
) => {
	switch (type) {
		case types.setNode:
			return { nodeID: data }
		case types.addNode:
			return { nodeID: data }
		// data is ID and new data
		case types.editNode: {
			// it's important that you create a new object here
			// in order to notify react flow about the change
			const newNodes = state.nodes.map((node) => {
				if (node.id === data.nodeID) {
					// if the ID is different, we'll need to modify
					// edges as well
					if (data.nodeData.id !== node.id) {
						node.id = data.nodeData.id
					}
					node.data = data.nodeData
				}
				return node
			})
			return { nodes: newNodes }
		}
		case types.setNodes:
			return { nodes: data }

		case types.editEdge: {
			const newEdges = state.edges.map((edge) => {
				if (edge.id === data.edgeID) {
					edge.data = data.edgeData
				}
				return edge
			})
			return { edges: newEdges }
		}
		case types.deleteEdge: {
			const out = state.edges.filter((e: { id: string }) => e.id !== data)
			state.setEdges(out)
			return {}
		}
		case types.setEdge: {
			return { edgeID: data.nodes }
		}

		case types.updateSourceHandle: {
			const out = state.edges.map((e: Edge<any>) => {
				if (e.sourceHandle === data.old) {
					e.sourceHandle = data.new
					e.data = { ...e.data }
				}
				return e
			})
			return {}
		}
		case types.updateTargetHandle: {
			const out = state.edges.map((e: Edge<any>) => {
				if (e.targetHandle === data.old) {
					e.targetHandle = data.new
					e.data = { ...e.data }
				}
				return e
			})
			return {}
		}

		case types.loadCustomNodes: {
			return {
				customNodes: data.nodes,
			}
		}

		case types.loadBuiltInNodes: {
			return {
				builtInNodes: data.nodes,
			}
		}

		case types.addCustomNode: {
			return {
				customNodes: [
					...state.customNodes.filter((n) => n.name !== data.name),
					data,
				],
				schema: null,
				mode: '',
			}
		}

		case types.deleteCustomNode: {
			return {
				customNodes: state.customNodes.filter((n) => n.name !== data),
			}
		}

		case types.customizeSchema: {
			return {
				mode: data.mode,
				schema: data.schema,
			}
		}

		// SCENE =================================================

		case types.createScene: {
			const { scenes } = state.workspace
			scenes[data] = {
				name: data,
				nodes: [
					{
						id: 'root',
						type: 'root',
						selectable: true,
						position: { x: 100, y: 100 },
						sourcePosition: Position.Left,
						targetPosition: Position.Right,
						data: {
							label: 'ROOT',
							sources: [],
							targets: [],
							id: 'root,',
						},
					},
				],
				edges: [],
				viewport: { x: 0, y: 0, zoom: 100 },
			}
			return {
				workspace: {
					...state.workspace,
					scenes,
				},
				nodes: [
					{
						id: 'root',
						type: 'root',
						selectable: true,
						position: { x: 100, y: 100 },
						sourcePosition: Position.Left,
						targetPosition: Position.Right,
						data: {
							label: 'ROOT',
							sources: [],
							targets: [],
							id: 'root,',
						},
					},
				],
				edges: [],
				activeScene: data,
			}
		}

		case types.deleteScene: {
			const { scenes } = state.workspace
			delete scenes[data]

			return {
				workspace: {
					...state.workspace,
					scenes,
				},
			}
		}

		case types.renameScene: {
			const { scenes } = state.workspace

			// https://stackoverflow.com/questions/4647817/javascript-object-rename-key
			delete Object.assign(scenes, {
				[data.newName]: scenes[data.oldName],
			})[data.oldName]

			return {
				workspace: {
					...state.workspace,
					scenes,
				},
			}
		}

		case types.changeScene: {
			const { scenes } = state.workspace
			const newScene = state.workspace.scenes[data]

			scenes[state.activeScene] = {
				...state.workspace.scenes[state.activeScene],
				nodes: state.nodes,
				edges: state.edges,
			}

			return {
				activeScene: data,
				nodes: newScene.nodes,
				edges: newScene.edges,
				workspace: {
					...state.workspace,
					scenes,
				},
			}
		}

		// WORKSPACE ===================================================

		case types.createWorkspace: {
			return {
				nodes: [
					{
						id: 'root',
						type: 'root',
						selectable: true,
						position: { x: 100, y: 100 },
						sourcePosition: Position.Left,
						targetPosition: Position.Right,
						data: {
							label: 'ROOT',
							sources: [],
							targets: [],
							id: 'root,',
						},
					},
				],
				workspace: {
					name: null,
					scenes: {
						default: {
							name: data.workspaceName,
							nodes: initialElements,
							edges: [],
							viewport: { x: 0, y: 0, zoom: 1 },
						},
					},
					schemas: [],
				},
				edges: [],
				activeScene: 'untitled',
			}
		}

		case types.loadWorkspace: {
			let hasScenes = false
			let sceneName = ''
			if (data.scenes) {
				;[sceneName] = Object.keys(data.scenes)
				if (data.scenes[sceneName]) {
					hasScenes = true
				}
			}
			return {
				workspace: data,
				nodes: hasScenes ? data.scenes[sceneName].nodes : [],
				edges: hasScenes ? data.scenes[sceneName].edges : [],
				activeScene: hasScenes ? sceneName : 'untitled',
			}
		}

		case types.renameWorkspace: {
			return {
				workspace: {
					...state.workspace,
					name: data.newName,
				},
			}
		}

		case types.addCustomWorkspaceNode: {
			return {
				workspace: {
					...state.workspace,
					schemas: [
						...state.workspace.schemas.filter(
							(n) => n.name !== data.name
						),
						data,
					],
				},
			}
		}

		case types.deleteCustomWorkspaceNode: {
			return {
				workspace: {
					...state.workspace,
					schemas: [
						state.workspace.schemas.filter((n) => n.name !== data),
					],
				},
			}
		}

		default:
			return {}
	}
}

// this is our useStore hook that we can use in our components
// to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
	nodeID: null,
	edgeID: null,
	nodes: initialElements,
	mode: 'active',
	schema: null,
	edges: [],
	builtInNodes: [],
	customNodes: [],
	activeScene: 'untitled',
	workspace: {
		name: null,
		scenes: {
			default: {
				name: 'default',
				nodes: initialElements,
				edges: [],
				viewport: { x: 0, y: 0, zoom: 1 },
			},
		},
		schemas: [],
	},
	reset: () => {
		set({
			nodes: [
				{
					id: 'root',
					type: 'root',
					selectable: true,
					position: { x: 100, y: 100 },
					sourcePosition: Position.Left,
					targetPosition: Position.Right,
					data: {
						label: 'ROOT',
						sources: [],
						targets: [],
						id: 'root,',
					},
				},
			],
			workspace: {
				name: null,
				scenes: {
					default: {
						name: 'untitled',
						nodes: initialElements,
						edges: [],
						viewport: { x: 0, y: 0, zoom: 1 },
					},
				},
				schemas: [],
			},
		})
	},

	updateNodeHandles: (nodeID, sources, targets) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeID) {
					node.data = {
						...node.data,
						sources,
						targets,
					}
				}
				return node
			}),
		})
	},
	setNodes: (newNodes: Node[]) => {
		set({ nodes: newNodes })
	},
	setEdges: (newEdges: Edge[]) => {
		set({ edges: newEdges })
	},
	addNode: (newNode: Node<any>) => {
		set({
			nodes: get().nodes.concat(newNode),
		})
	},
	onNodesChange: (changes: NodeChange[]) => {
		set({
			nodes: applyNodeChanges(changes, get().nodes),
		})
	},
	setSelectedNodes: (selected: Node[]) => {
		set({
			nodes: get().nodes.map((n) => {
				if (selected.find((s) => s.id === n.id)) n.selected = true
				return n
			}),
		})
	},
	onEdgesChange: (changes: EdgeChange[]) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		})
	},
	onConnect: (connection: Connection | Edge) => {
		set({
			edges: addEdge(connection, get().edges),
		})
	},
	updateDialogueData: (nodeID: string, d: string) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeID) {
					// it's important to create a new object here, to inform React Flow about the cahnges
					node.data = { ...node.data, dialogue: d }
				}
				return node
			}),
		})
	},
	deleteEdge: (id: string) => set({ edgeID: id }),
	editNode: (id: string) => set({ nodeID: id }),
	dispatch: (args: { type: any; data: any }) =>
		set((state) => reducer(state, args)),
	updateNodeColor: (nodeId: string, color: string) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId) {
					// it's important to create a new object here, to inform React Flow about the cahnges
					node.data = { ...node.data, color }
				}

				return node
			}),
		})
	},
	updateNodeName: (nodeId: string, name: string) => {
		set({
			nodes: get().nodes.map((node) => {
				if (node.id === nodeId) {
					// it's important to create a new object here, to inform React Flow about the cahnges
					node.data = { ...node.data, name }
				}

				return node
			}),
		})
	},
}))

export default useStore
