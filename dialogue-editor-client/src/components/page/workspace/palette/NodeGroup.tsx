import React, { useEffect, useState } from 'react'
import { Schema } from '../../../../helpers/types'
import PaletteItem from './PaletteItem'
import { Group } from './styles'

const NodeGroup: React.FC<{
	data: Schema[]
	title: string
}> = ({ data, title }) => {
	return (
		<Group draggable="false">
			{title}
			{data &&
				data.length > 0 &&
				data.map((node, index) => {
					return (
						<PaletteItem
							key={node.name}
							name={node.name}
							classname={node.className}
							type={node.type}
							fields={node.fields}
						/>
					)
				})}
		</Group>
	)
}

export default NodeGroup
