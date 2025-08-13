import React, { useState } from 'react'
import { NodeProps } from 'reactflow'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { FlexRow } from '@/components/styles'
import PlusCircleIcon from '@/components/Icons/PlusCircle'
import SaveIcon from '@/components/Icons/Save'
import NotepadIcon from '@/components/Icons/Notepad'
import { useNodeFields } from '@/helpers/useNodeFields'
import BaseNode from './BaseNode'

export default function SourceNode({
	id,
	data,
	selected,
	...props
}: NodeProps<{ id: string; name: string; fields: any[]; color: string }>) {
	const { nodes, deleteNode, dispatch, updateNodeColor, mode } = useStore()
	const { fields, errors, addField, deleteField, updateDataFieldKey } =
		useNodeFields(id, data)

	const header = (
		<>
			<FlexRow style={{ gap: 4, justifyContent: 'center' }}>
				<button
					className="btn-primary"
					onClick={() => addField('data')}
				>
					<PlusCircleIcon />
				</button>
				<button
					className="btn-primary"
					onClick={() => dispatch({ type: types.setNode, data: id })}
				>
					<NotepadIcon />
				</button>
				{mode !== 'customize' && (
					<button
						className="btn-primary"
						onClick={() =>
							dispatch({
								type: types.setSaveNodes,
								data: nodes.filter((n) => n.id === id),
							})
						}
					>
						<SaveIcon />
					</button>
				)}
			</FlexRow>
		</>
	)

	return (
		<BaseNode
			name={data.name}
			color={data.color}
			id={id}
			data={data}
			selected={selected}
			// header={header}
			header={header}
			{...props}
		/>
	)
}
