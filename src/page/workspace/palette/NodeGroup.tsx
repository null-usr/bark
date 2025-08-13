import React from 'react'
import { Schema } from '@/helpers/types'
import { FlexColumn, FlexRow } from '@/components/styles'
import { H4 } from '@/components/Typography/headers'
import PaletteItem from './PaletteItem'

const NodeGroup: React.FC<{
	data: Schema[]
	title: string
	modable?: boolean
	flex?: number
	onCreate?: () => void
}> = ({ data, title, modable, onCreate, flex = 1 }) => {
	return (
		<FlexColumn
			style={{
				minHeight: 0,
				gap: 16,
			}}
		>
			<H4 color="white">{title}</H4>
			<div>
				<FlexColumn>
					{!data ||
						(data.length === 0 && (
							<button
								className="btn-secondary"
								onClick={onCreate}
							>
								+ Create Node
							</button>
						))}
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
		</FlexColumn>
	)
}

export default NodeGroup
