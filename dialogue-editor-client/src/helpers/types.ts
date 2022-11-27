import { Edge, Node, Viewport } from 'reactflow'

export interface iFieldData {
	[key: string]: string
}

export type Field = {
	key: string
	type: string
	value?: any
}

// Schema for drag & drop nodes
export interface Schema {
	name: string
	type: string
	className: string
	color?: string
	fields?: any[]
	// our schema can also represent a group of nodes
	nodes?: any[]
	edges?: any[]
}

export type Scene = {
	name: string
	nodes: Node<any>[]
	edges: Edge<any>[]
	viewport: Viewport
}

export type Workspace = {
	name: string | null // when the name is null, that's when we ask when they save, what they want to name it
	scenes: { [key: string]: Scene }
	schemas: Schema[]
}
