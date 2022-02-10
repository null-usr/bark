import React, { useEffect, useState } from 'react'
import PaletteItem from './PaletteItem'
import { Group } from './styles'

interface INodeList {
	nodes: [
		{
			name: string
			type: string
			classname: string
		}
	]
}

const NodeGroup: React.FC<{
	source: string
	title: string
}> = ({ source, title, ...props }) => {
	const [data, setData] = useState<INodeList>()

	useEffect(() => {
		async function loadNodes() {
			fetch(source)
				.then((response) => response.json())
				.then((d) => setData(d))
		}

		loadNodes()
	}, [])

	return (
		<Group draggable="false">
			{title}
			{data &&
				data.nodes.map((node, index) => {
					return (
						<PaletteItem
							key={node.name}
							name={node.name}
							classname={node.classname}
							type={node.type}
						/>
					)
				})}
		</Group>
	)
}

export default NodeGroup
