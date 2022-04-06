// we'll want to save scenes to be loaded by our editor and
// serialize lite versions to be loaded by the game engines

import { Edge, FlowExportObject } from 'react-flow-renderer'
import { IReactFlow } from '../contexts/FlowContext'
import { BasicNode } from './BasicNode'
import DataEdge from './DataEdge'

export interface ISceneData {
	nodes: Array<any>
	edges: Array<any>
	zoom: number
	position: [number, number]
}

export function LoadScene(scene: string): FlowExportObject {
	// https://www.thomasmaximini.com/json-stringify-symbols-and-react-components
	// in order to properly stringafy & parse generic react components
	const data: ISceneData = JSON.parse(scene, (k, v) => {
		const matches = v && v.match && v.match(/^\$\$Symbol:(.*)$/)

		return matches ? Symbol.for(matches[1]) : v
	})

	const out: FlowExportObject = {
		elements: [],
		position: [data.position[0], data.position[1]],
		zoom: data.zoom,
	}

	out.elements = [...data.nodes, ...data.edges]

	// for every element in our node list, if the fields key exists
	// we create a basic node, otherwise just push the raw react component
	// data.nodes.forEach((node) => {
	// 	if (node.fields) {
	// 		const newBasic = new BasicNode(node.x, node.y, node.id, node.fields)
	// 		out.elements.push(newBasic)
	// 	} else {
	// 		out.elements.push(node)
	// 	}
	// })

	return out
}

export function SaveScene(scene: FlowExportObject) {
	const out: ISceneData = {
		nodes: [],
		edges: [],
		zoom: 0,
		position: [0, 0],
	}

	// for every element, add nodes to the nodes list and edges
	// to the edges
	scene.elements.forEach((element) => {
		const edge = element as Edge

		if (edge.source) {
			out.edges.push(edge)
		} else {
			out.nodes.push(element)
		}
	})

	out.zoom = scene.zoom
	out.position = scene.position

	// to allow for encoding of general react components
	return JSON.stringify(out, (k, v) =>
		typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
	)
}

export function SerializeScene(scene: IReactFlow) {
	console.log(scene)
	const out: any = {}
	const edges: Edge[] = []

	scene.elements.forEach((element) => {
		const node = element as BasicNode
		const edge = element as Edge
		if (typeof node.serialize === 'function') {
			const tmp = node.serialize()
			out[element.id] = tmp[element.id]
		} else if (edge.source) {
			edges.push(edge)
		}
	})

	edges.forEach((edge) => {
		if (edge.type !== 'data') {
			out[edge.source].next = edge.target
		} else {
			const dataEdge = edge as DataEdge
			out[edge.source][dataEdge.name] = dataEdge.target
		}
	})

	return JSON.stringify(out)
}
