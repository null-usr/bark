// canvasHandlers.ts
import React from 'react'
import { Connection, Edge, OnConnectStartParams } from 'reactflow'
import { DataEdge } from '@/helpers/classes/DataEdge'
import { BasicNode } from '@/helpers/classes/BasicNode'
import { decodeSchema } from '@/helpers/serialization/decodeSchema'

interface HandlersParams {
	onConnect: (edge: Edge | Connection) => void
	addNode: (node: any) => void
	reactFlowInstance: any
	connectionAttemptRef: React.MutableRefObject<OnConnectStartParams | null>
	setConnectionAttempt: React.Dispatch<
		React.SetStateAction<OnConnectStartParams | null>
	>
	reactFlowWrapperRef: React.RefObject<any>
	nodes: any[]
	edges: any[]
}

export function useCanvasHandlers({
	onConnect,
	addNode,
	reactFlowInstance,
	connectionAttemptRef,
	setConnectionAttempt,
	reactFlowWrapperRef,
	nodes,
	edges,
}: HandlersParams) {
	const onCustomConnect = React.useCallback(
		(params: Connection) => {
			setConnectionAttempt(null)
			if (params.sourceHandle) {
				const edge: Edge = new DataEdge(
					params.source!,
					params.target!,
					connectionAttemptRef.current!.handleId,
					null
				)
				onConnect(edge)
			} else {
				onConnect({ ...params, type: 'step' })
			}
		},
		[onConnect, setConnectionAttempt, connectionAttemptRef]
	)

	const onConnectStart = React.useCallback(
		(
			event: React.MouseEvent<Element, MouseEvent>,
			params: OnConnectStartParams
		) => {
			if (event.button !== 2) {
				setConnectionAttempt(params)
			}
		},
		[setConnectionAttempt]
	)

	const onConnectEnd = React.useCallback(
		(event: React.MouseEvent<Element, MouseEvent>) => {
			if (!connectionAttemptRef.current) return

			event.preventDefault()

			const reactFlowBounds =
				reactFlowWrapperRef.current.getBoundingClientRect()
			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})
			const newNode = new BasicNode('BASE', position.x, position.y)

			let edge: Edge

			if (connectionAttemptRef.current.handleType === 'source') {
				edge = new DataEdge(
					connectionAttemptRef.current.nodeId!,
					newNode.id,
					connectionAttemptRef.current.handleId,
					null
				)
			} else {
				edge = new DataEdge(
					newNode.id,
					connectionAttemptRef.current.nodeId!,
					null,
					null
				)
			}

			addNode(newNode)
			onConnect(edge)
			setConnectionAttempt(null)
		},
		[
			addNode,
			onConnect,
			reactFlowInstance,
			reactFlowWrapperRef,
			setConnectionAttempt,
		]
	)

	const onDragOver = React.useCallback((event: React.DragEvent) => {
		event.preventDefault()
		event.dataTransfer.dropEffect = 'move'
	}, [])

	const onDrop = React.useCallback(
		(event: React.DragEvent) => {
			event.preventDefault()
			const reactFlowBounds =
				reactFlowWrapperRef.current.getBoundingClientRect()
			const data = event.dataTransfer.getData('application/reactflow')
			const paletteItem = JSON.parse(data)
			const position = reactFlowInstance.screenToFlowPosition({
				x: event.clientX - reactFlowBounds.left,
				y: event.clientY - reactFlowBounds.top,
			})

			const { newNodes, newEdges } = decodeSchema(position, paletteItem)

			newNodes.forEach((n) => addNode(n))
			newEdges.forEach((e) => onConnect(e))
		},
		[reactFlowInstance, reactFlowWrapperRef, addNode, onConnect]
	)

	return {
		onCustomConnect,
		onConnectStart,
		onConnectEnd,
		onDragOver,
		onDrop,
	}
}
