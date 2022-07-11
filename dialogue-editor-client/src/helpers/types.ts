export interface iFieldData {
	[key: string]: string
}

export type Field = {
	key: string
	type: string
	value?: any
}

export interface Schema {
	name: string
	type: string
	className: string
	fields?: any[]
}
