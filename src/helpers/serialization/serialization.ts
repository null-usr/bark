// we'll want to save scenes to be loaded by our editor and
// serialize lite versions to be loaded by the game engines

import { Edge, Node, ReactFlowJsonObject } from 'reactflow'
import { Field, Scene, Workspace } from '../types'

export interface ISceneData extends ReactFlowJsonObject {
	scenes?: string[]
}

export const SerializeNode = (
	name: string,
	color: string,
	type: string,
	f: Field[]
) => {
	const out = {
		name,
		color,
		type,
		fields: f,
	}
	return out
}

export const SerializeGroup = (
	name: string,
	color: string,
	nodes: Node[],
	edges: Edge[]
) => {
	const mostLeftNode = nodes.reduce((min: Node, node) =>
		min && min.position.x < node.position.x ? min : node
	)
	const out = {
		name,
		color,
		type: 'group',
		nodes: [],
		edges: [],
	}

	return out
}

export function SaveScene(scene: ReactFlowJsonObject) {
	const out: ISceneData = {
		nodes: [],
		edges: [],
		viewport: { x: 0, y: 0, zoom: 0 },
	}

	// to allow for encoding of general react components
	return JSON.stringify(scene, (k, v) =>
		typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
	)
}

export function SaveWorkspace(workspace: Workspace) {
	return JSON.stringify(workspace, (k, v) =>
		typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
	)
}

export function LoadScene(scene: string): ReactFlowJsonObject | null {
	try {
		// https://www.thomasmaximini.com/json-stringify-symbols-and-react-components
		// in order to properly stringafy & parse generic react components
		const data: ReactFlowJsonObject = JSON.parse(scene, (k, v) => {
			const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

			return matches ? Symbol.for(matches[1]) : v
		})

		const out: ReactFlowJsonObject = {
			nodes: [],
			edges: [],
			viewport: data.viewport,
		}

		out.nodes = data.nodes
		out.edges = data.edges

		return out
	} catch (e) {
		return null
	}
}

export function LoadWorkspace(
	workspace: string
): { workspace?: Workspace } | null {
	try {
		const data: any = JSON.parse(workspace, (k, v) => {
			const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

			return matches ? Symbol.for(matches[1]) : v
		})

		return data
	} catch (e) {
		console.log(e)
		return null
	}
}

export function SerializeScene(scene: ReactFlowJsonObject) {
	const out: any = {}

	// do some processing aka remove zoom + node positions

	// scene.elements.forEach((element) => {
	// 	const node = element as BasicNode
	// 	const edge = element as Edge
	// 	if (typeof node.serialize === 'function') {
	// 		const tmp = node.serialize()
	// 		out[element.id] = tmp[element.id]
	// 	} else if (edge.source) {
	// 		edges.push(edge)
	// 	}
	// })

	// edges.forEach((edge) => {
	// 	if (edge.type !== 'data') {
	// 		out[edge.source].next = edge.target
	// 	} else {
	// 		const dataEdge = edge as DataEdge
	// 		out[edge.source][dataEdge.name] = dataEdge.target
	// 	}
	// })

	return JSON.stringify(scene)
}

// return an array of the workspace's serialized scenes
export function SerializeWorkspace(workspace: Workspace) {
	const sceneKeys = Object.keys(workspace.scenes)
	const out: string[] = []
	sceneKeys.forEach((scene) => {
		out.push(JSON.stringify(workspace.scenes[scene]))
	})
	return out
}
