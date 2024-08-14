import React from 'react'
import { Schema } from '@/helpers/types'
import { FlexColumn } from '@/components/styles'
import { H3 } from '@/components/Typography/headers'
import PaletteItem from './PaletteItem'

const NodeGroup: React.FC<{
	data: Schema[]
	title: string
	modable?: boolean
	flex?: number
}> = ({ data, title, modable, flex = 1 }) => {
	return (
		<>
			<H3 style={{ margin: 0 }} color="white">
				{title}
			</H3>
			<div
				style={{
					padding: 8,
					// flex,
					overflowY: 'auto',
					overflowX: 'hidden',
				}}
			>
				<FlexColumn>
					{data &&
						data.length > 0 &&
						data.map((node, index) => {
							return (
								<PaletteItem
									key={node.name}
									name={node.name}
									className={node.className}
									type={node.type}
									fields={node.fields}
									nodes={node.nodes}
									edges={node.edges}
									modable={modable}
									color={node.color}
								/>
							)
						})}
				</FlexColumn>
			</div>
		</>
	)
}

export default NodeGroup
