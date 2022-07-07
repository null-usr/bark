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
	useEdges,
} from 'react-flow-renderer'
import create from 'zustand'
import initialElements from '../helpers/initial-elements'

export const types = {
	setNode: 'SET_NODE',
	editNode: 'EDIT_NODE',
	addNode: 'ADD_NODE',
	deleteNode: 'DELTE_NODE',
	setEdge: 'SET_EDGE',
	addEdge: 'ADD_EDGE',
	deleteEdge: 'DELETE_EDGE',
}

export type RFState = {
	nodeID: string | null
	edgeID: string | null
	nodes: Node[]
	edges: Edge[]
	onNodesChange: OnNodesChange
	onEdgesChange: OnEdgesChange
	addNode: (newNode: Node<any>) => void
	updateDialogueData: (nodeID: string, d: string) => void
	// setEdges: any
	onConnect: OnConnect
	deleteEdge: (id: string) => void
	editNode: (id: string) => void
	dispatch: (args: { type: any; data: any }) => void
	updateNodeColor: (nodeId: string, color: string) => void
}

export type State = {
	nodeID: string | null
	edgeID: string | null
	deleteEdge: (id: string) => void
	editNode: (id: string) => void
	dispatch: (args: { type: any; data: any }) => void
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
		case types.deleteEdge:
			return { edgeID: data }
		// data is ID and new data
		case types.editNode: {
			// it's important that you create a new object here
			// in order to notify react flow about the change
			const newNodes = state.nodes.map((node) => {
				if (node.id === data.nodeID) {
					node.data = { ...node.data, dialogue: data.nodeData }
				}
				return node
			})
			return { nodes: newNodes }
		}
		default:
			return {}
	}
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
	nodeID: null,
	edgeID: null,
	nodes: initialElements,
	edges: [],
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
	onEdgesChange: (changes: EdgeChange[]) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		})
	},
	onConnect: (connection: Connection) => {
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
}))

export default useStore
