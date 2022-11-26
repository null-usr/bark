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
