import DataEdge from '@/components/edges/DataEdge'
import { Edge, Node } from 'reactflow'

export const getOutgoingEdges = (id: string, edges: Edge<any>[]) => {
	return edges.filter((edge) => edge.source === id)
}

export const getIncomingEdges = (id: string, edges: Edge<any>[]) => {
	return edges.filter((edge) => edge.target === id)
}

// given an edge, create two new edges, the first w/ the same data
// and other w/ no data
// maybe improve to handle a second split node for the out
export const splitEdge = (original: Edge<any>, splitNode: Node<any>) => {
	// console.log(original)
	const e1 = new DataEdge(
		original.source,
		splitNode.id,
		// @ts-ignore
		original.sourceHandle,
		null,
		// @ts-ignore
		original.name,
		original.data
	)

	const e2 = new DataEdge(
		splitNode.id,
		original.target,
		null,
		// @ts-ignore
		original.targetHandle
		// original.name,
		// original.data
	)

	return [e1, e2]
}
