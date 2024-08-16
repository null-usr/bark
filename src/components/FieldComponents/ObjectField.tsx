/*
    Object is a key with a react-flow handle attachable to another node
	Edge ID doesn't matter so long as the handle IDs match so it corresponds to 
	the correct handle
*/

import React, { useEffect, useRef, useState } from 'react'
import { Edge, Handle, Position, useUpdateNodeInternals } from 'reactflow'
import Button from '@/components/Button/Button'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import { FieldContainer } from './styles'
import { FlexRow } from '../styles'

export const ObjectField: React.FC<{
	k: string
	v: string
	index: number
	id: string
	color?: string
	update: (index: number, v: string) => void
	// add is a function
	add: (name: string) => void
	del?: (k: string) => void
	error?: boolean
}> = ({ k, v, index, id, error, color, add, update, del }) => {
	const updateNodeInternals = useUpdateNodeInternals()
	const dispatch = useStore((state) => state.dispatch)

	const { edges } = useStore()
	const [yOffset, setYOffset] = useState(0)
	const [handleID, setHandleID] = useState('')
	const [value, setValue] = useState(k)

	const ref = useRef(null)

	useEffect(() => {
		if (ref.current) {
			// @ts-ignore
			setYOffset(ref.current.offsetTop + 16)
			// to force a rerender so the last handle drag and drop is
			// positioned correctly
			// add(k)
			updateNodeInternals(id)
		}
	}, [ref])

	return (
		<FieldContainer error={error} ref={ref}>
			<FlexRow style={{ marginRight: 16 }}>
				<input
					type="text"
					value={value}
					onChange={(e) => {
						setValue(e.target.value)
					}}
					// onSubmit={() => update(index, value)}
				/>
				{value !== k && (
					<Button onClick={() => update(index, value)}>
						Update Key
					</Button>
				)}
				<Button danger onClick={del ? () => del(k) : undefined}>
					Delete
				</Button>
			</FlexRow>
			<Handle
				key={k}
				type="source"
				position={Position.Right}
				id={k}
				style={{
					// @ts-ignore
					top: yOffset, // function to position the handle, should be at same height as this object + centering offset
					right: -3,
					zIndex: 100,
					background: color,
				}}
				onContextMenu={(event) => {
					event.preventDefault()
					// remove('S', i)
					const edge: Edge<any> = edges.filter((e) => {
						return e.source === k
					})[0]

					dispatch({ type: types.deleteEdge, data: edge.id })
				}}
			/>
		</FieldContainer>
	)
}
