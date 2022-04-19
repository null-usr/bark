import { useEdges } from 'react-flow-renderer'
import create from 'zustand'

export const types = {
	setNode: 'SET_NODE',
	addNode: 'ADD_NODE',
	deleteNode: 'DELTE_NODE',
	setEdge: 'SET_EDGE',
	addEdge: 'ADD_EDGE',
	deleteEdge: 'DELETE_EDGE',
}

export type State = {
	nodeID: string | null
	edgeID: string | null
	deleteEdge: (id: string) => void
	editNode: (id: string) => void
	dispatch: (args: { type: any; data: any }) => void
}

const reducer = (state: State, { type, data }: { type: string; data: any }) => {
	switch (type) {
		case types.setNode:
			return { nodeID: data }
		case types.addNode:
			return { nodeID: data }
		case types.deleteEdge:
			return { edgeID: data }
		default:
			return {}
	}
}

const useStore = create<State>((set) => ({
	nodeID: null,
	edgeID: null,
	deleteEdge: (id: string) => set((state) => ({ edgeID: id })),
	editNode: (id: string) => set((state) => ({ nodeID: id })),
	dispatch: (args: { type: any; data: any }) =>
		set((state) => reducer(state, args)),
}))

export default useStore
