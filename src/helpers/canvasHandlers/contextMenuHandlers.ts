// contextMenuHandlers.ts
import { useCallback, useRef } from 'react'

export function useContextMenuHandlers({
	setContextMenuData,
	setSelectedNodes,
}: {
	setContextMenuData: React.Dispatch<React.SetStateAction<any | null>>
	setSelectedNodes: React.Dispatch<React.SetStateAction<any[]>>
}) {
	const contextMenuRef = useRef<HTMLElement | null>(null)

	const onNodeContextMenu = useCallback(
		(event: React.MouseEvent, node: any) => {
			event.preventDefault()
			if (!contextMenuRef.current) return

			const pane = contextMenuRef.current.getBoundingClientRect()

			setContextMenuData({
				contextNodes: [node],
				x: node.position.x + 30,
				y: node.position.y + 30,
				top:
					event.clientY + 200 < pane.height
						? event.clientY
						: event.clientY - 200,
				left:
					event.clientX + 200 < pane.width
						? event.clientX
						: event.clientX - 200,
			})
		},
		[setContextMenuData]
	)

	const onSelectionContextMenu = useCallback(
		(event: React.MouseEvent, nodes: any[]) => {
			event.preventDefault()
			if (!contextMenuRef.current) return

			const pane = contextMenuRef.current.getBoundingClientRect()

			setContextMenuData({
				x: nodes[0].position.x + 100,
				y: nodes[0].position.y + 100,
				contextNodes: nodes,
				top:
					event.clientY + 200 < pane.height
						? event.clientY
						: undefined,
				left:
					event.clientX + 200 < pane.width
						? event.clientX
						: undefined,
				right:
					event.clientX + 200 >= pane.width
						? pane.width - event.clientX
						: 0,
				bottom:
					event.clientY + 200 >= pane.height
						? pane.height - event.clientY
						: 0,
			})
		},
		[setContextMenuData]
	)

	const onPaneCanvasContextMenu = useCallback(
		(event: React.MouseEvent) => {
			event.preventDefault()
			setContextMenuData(null)
			setSelectedNodes([])
		},
		[setContextMenuData, setSelectedNodes]
	)

	return {
		contextMenuRef,
		onNodeContextMenu,
		onSelectionContextMenu,
		onPaneCanvasContextMenu,
	}
}
