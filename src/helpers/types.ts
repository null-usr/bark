import { Edge, isEdge, isNode, Node, Viewport } from 'reactflow'
import DialogueNodeType, { DialogueNode } from '@/components/nodes/DialogueNode'
import BasicNodeType from '@/components/nodes/BasicNode/BasicNode'
import ColorChooserNode from '@/components/nodes/ColorChooserNode'
import RootNodeType from '@/components/nodes/RootNode'
import SourceNodeType from '@/components/nodes/SourceNode'
import BaseNodeType from '@/components/nodes/BaseNode'
import DataEdgeType from '@/components/edges/DataEdge'

type TypeChecker<T> = (obj: any) => obj is T

/**
 * A function that generates a type checker function for a given type.
 * @param typeChecker - An object that specifies the structure of the type to check.
 * @returns A function that takes an object and returns true if it matches the specified type.
 */
function createTypeChecker<T>(typeChecker: TypeChecker<T>): TypeChecker<T> {
	return (obj: any): obj is T => {
		if (!typeChecker(obj)) {
			return false
		}
		return true
	}
}

function isArrayOfType<T>(
	arr: any,
	typeChecker: (item: any) => item is T
): arr is T[] {
	// Check if it's an array
	if (!Array.isArray(arr)) {
		return false
	}
	// Check if all elements in the array match the type
	return arr.every(typeChecker)
}

export const NodeTypes = {
	base: BasicNodeType,
	root: RootNodeType,
	source: SourceNodeType,
	default: BaseNodeType,
	dialogue: DialogueNodeType,
	colorChooser: ColorChooserNode,
}

export const EdgeTypes = {
	data: DataEdgeType,
}

export interface iFieldData {
	[key: string]: string
}

export type Field = {
	key: string
	type: string
	value?: any
}

function isField(obj: any): obj is Field {
	if (typeof obj.key !== 'string' || typeof obj.type !== 'string') {
		return false
	}
	return true
}

export type workspaceVar = {
	type: 'number' | 'string'
	options: number[] | string[]
}

function isWorkspaceVar(obj: any): obj is Field {
	if (
		obj.type !== 'string' ||
		obj.type !== 'number' ||
		obj.options === undefined
	) {
		return false
	}
	if (
		obj.type === 'string' &&
		!isArrayOfType(
			obj.options,
			(a0): a0 is unknown => typeof a0 === 'string'
		)
	) {
		return false
	}
	if (
		obj.type === 'number' &&
		!isArrayOfType(
			obj.options,
			(a0): a0 is unknown => typeof a0 === 'number'
		)
	) {
		return false
	}
	return true
}

// TODO: only have groups ofnodes and edges
// Schema for drag & drop nodes
export interface Schema {
	name: string
	type: string
	className: string
	color?: string
	fields?: any[]
	nodes?: Schema[]
	edges?: {
		handle?: string
		from: number
		to: number
	}[]
}

export function isSchema(obj: any): obj is Schema {
	// Check required fields
	if (
		(typeof obj.name !== 'string' && obj.name !== null) ||
		typeof obj.type !== 'string' ||
		obj.className !== 'string'
	) {
		return false
	}
	// optional fields
	if (obj.color !== undefined && typeof obj.color !== 'string') {
		return false
	}
	if (obj.nodes !== undefined && !isArrayOfType(obj.nodes, isSchema)) {
		return false
	}
	if (
		obj.edges !== undefined &&
		!isArrayOfType(obj.edges, (e: any): e is unknown => {
			if (typeof e.from !== 'number' || typeof e.to !== 'number')
				return false
			if (e.handle !== undefined && typeof e.handle !== 'string')
				return false
			return true
		})
	) {
		return false
	}
	if (obj.fields !== undefined && !isArrayOfType(obj.fields, isField)) {
		return false
	}
	return true
}

export const schemaChecker = createTypeChecker<Schema>(isSchema)

export type Scene = {
	name: string | null
	nodes: Node<any>[]
	edges: Edge<any>[]
	viewport: Viewport
}

export function isScene(obj: any): obj is Scene {
	// Check required fields
	// @ts-itnore
	if (
		(typeof obj.name !== 'string' && obj.name !== null) ||
		!isArrayOfType(obj.nodes, isNode) ||
		!isArrayOfType(obj.edges, isEdge) ||
		obj.viewport === undefined
	) {
		return false
	}
	return true
}

export const sceneChecker = createTypeChecker<Scene>(isScene)

export type Workspace = {
	name: string | null // when the name is null, that's when we ask when they save, what they want to name it
	scenes: { [key: string]: Scene }
	schemas: Schema[]
	w_vars: {
		[key: string]: {
			type: 'number' | 'string'
			options: number[] | string[]
		}
	}
}

export function isWorkspace(obj: any): obj is Workspace {
	// Check required fields
	// @ts-itnore
	if (
		(typeof obj.name !== 'string' && obj.name !== null) ||
		obj.scenes === undefined ||
		obj.schemas === undefined
	) {
		return false
	}

	const scenes = Object.values(obj.scenes)
	const schemas = Object.values(obj.schemas)
	const w_vars = Object.values(obj.w_vars)

	if (!isArrayOfType(scenes, isScene)) {
		return false
	}
	if (!isArrayOfType(schemas, isSchema)) {
		return false
	}
	if (!isArrayOfType(w_vars, isWorkspaceVar)) {
		return false
	}
	return true
}

export const workspaceChecker = createTypeChecker<Workspace>(isWorkspace)
