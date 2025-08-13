/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react'
import { NodeProps } from 'reactflow'
import useStore from '@/store/store'
import { Field } from '@/helpers/types'
import AddFields from './AddFields'
import { useNodeFields } from '@/helpers/useNodeFields'
import BaseNode from '../BaseNode'

export default ({
	id,
	data,
	isConnectable,
	selected,
	...props
}: NodeProps<{ name: string; color: string; fields: Field[] }>) => {
	const { workspace } = useStore()

	const { addField } = useNodeFields(id, data)

	// const [nodeWidth, setNodeWidth] = useState(50)
	// const [nodeHeight, setNodeHeight] = useState(50)

	return (
		<>
			<BaseNode
				id={id}
				data={data}
				selected={selected}
				isConnectable={isConnectable}
				header={
					<AddFields
						addField={addField}
						hasCustomVars={Object.keys(workspace.w_vars).length > 0}
					/>
				}
				body={<></>}
				name={data.name}
				color={data.color}
				{...props}
			/>
			{/* TODO: disabled until vertical resize can play well w/ 
			additional fields being added */}
			{/* {expanded && (
				<NodeResizeControl
					style={controlStyle}
					minWidth={nodeWidth}
					minHeight={nodeHeight}
				>
					<ResizeIcon />
				</NodeResizeControl>
			)} */}
		</>
	)
}
