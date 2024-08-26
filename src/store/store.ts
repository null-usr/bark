import {
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
	Connection,
	Edge,
	EdgeChange,
	Node,
	NodeChange,
	Position,
} from 'reactflow'
import { v4 as uuid } from 'uuid'
import { create } from 'zustand'
import initialElements from '../helpers/initial-elements'
import { reducer, RFState } from './reducer'

// this is our useStore hook that we can use in our components
// to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
	theme: null,
	editNodeID: null,
	editEdgeID: null,
	saveNodes: null,
	nodes: initialElements,
	mode: 'active',
	schema: null,
	edges: [],
	builtInNodes: [],
	customNodes: [],
	activeScene: 'Default',
	workspace: {
		name: null,
		scenes: {
			Default: {
				name: 'Default',
				nodes: [],
				edges: [],
				viewport: { x: 0, y: 0, zoom: 100 },
			},
		},
		schemas: [],
		w_vars: {},
	},
	reset: () => {
		const newID = uuid()
		const tmpNodes = [
			{
				id: newID,
				type: 'source',
				selectable: true,
				position: { x: 100, y: 100 },
				sourcePosition: Position.Left,
				targetPosition: Position.Right,
				data: {
					name: 'ROOT',
					type: 'source',
					color: 'green',
					sources: [],
					targets: [],
					fields: [],
					id: newID,
				},
				fields: [],
			},
		]

		const tmpEdges: Edge<any>[] = []
		set({
			nodes: tmpNodes,
			edges: tmpEdges,
			workspace: {
				name: null,
				scenes: {
					Default: {
						name: 'Default',
						nodes: tmpNodes,
						edges: tmpEdges,
						viewport: { x: 0, y: 0, zoom: 100 },
					},
				},
				schemas: [],
				w_vars: {},
			},
		})
	},

	setTheme: (theme: any) => {
		set({
			theme,
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
	deleteEdge: (id: string) => set({ editEdgeID: id }),
	deleteNode: (id: string) =>
		set({
			nodes: get().nodes.filter((n) => n.id !== id),
			edges: applyEdgeChanges(
				get()
					.edges.filter(
						(e) =>
							e.sourceNode?.id === id || e.targetNode?.id === id
					)
					.map((e) => {
						return { id: e.id, type: 'remove' }
					}),
				get().edges
			),
		}),
	editNode: (id: string) => set({ editNodeID: id }),
	dispatch: (args: { type: any; data: any }) =>
		// @ts-ignore
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
