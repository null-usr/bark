import React from 'react'
import { Schema } from '@/helpers/types'
import { FlexColumn, FlexRow } from '@/components/styles'
import { H3, H4 } from '@/components/Typography/headers'
import Button from '@/components/Button/Button'
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
				gap: 0,
			}}
		>
			<FlexRow style={{ gap: 0 }}>
				<H4
					style={{
						margin: 0,
						padding: '8px 8px 0px 8px',
						borderLeft: '1px solid white',
						borderTop: '1px solid white',
						borderRight: '1px solid white',
					}}
					color="white"
				>
					{title}
				</H4>
				<div style={{ flex: 1, borderBottom: '1px solid white' }} />
			</FlexRow>
			<div
				style={{
					minHeight: 0,
					padding: 8,
					overflowY: 'auto',
					overflowX: 'hidden',
					borderLeft: '1px solid white',
					borderBottom: '1px solid white',
					borderRight: '1px solid white',
				}}
			>
				<FlexColumn>
					{!data ||
						(data.length === 0 && (
							<Button type="secondary" onClick={onCreate}>
								Create Node
							</Button>
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
