import React, { useState } from 'react'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import DeleteNode from '@/components/forms/node/DeleteNode'
import EditModal from '@/components/modal/EditModal'
import { FlexRow } from '@/components/styles'
import { Paragraph } from '@/components/Typography/text'
import IconButton from '@/components/Button/IconButton'
import NotepadIcon from '@/components/Icons/Notepad'
import CloseIcon from '@/components/Icons/Close'
import { NodeContainer } from './styles'

const PaletteItem: React.FC<{
	className: string
	name: string
	type: string
	fields?: any[]
	nodes?: any[]
	edges?: any[]
	color?: string
	modable?: boolean
}> = ({
	className,
	name,
	type,
	fields,
	nodes,
	edges,
	color,
	modable = false,
	...props
}) => {
	const dispatch = useStore((store) => store.dispatch)
	const displayName = name.replace('@workspace/', '')
	const [formMode, setFormMode] = useState('')

	const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
		const data = JSON.stringify({
			name,
			color,
			type,
			fields,
			nodes,
			edges,
			className,
		})
		event.dataTransfer.setData('application/reactflow', data)
		event.dataTransfer.effectAllowed = 'move'
	}

	return (
		<>
			{formMode === 'delete' && (
				<EditModal
					title="Delete Schema"
					isOpen
					close={() => setFormMode('')}
				>
					<DeleteNode
						name={name}
						submit={() => {
							dispatch({
								type:
									displayName === name
										? types.deleteCustomNode
										: types.deleteCustomWorkspaceNode,
								data: name,
							})
						}}
						cancel={() => setFormMode('')}
					/>
				</EditModal>
			)}
			<NodeContainer
				color={color}
				active={false}
				draggable="true"
				onDragStart={(event) => onDragStart(event)}
			>
				<FlexRow style={{ height: 16, backgroundColor: color }}>
					{/* <div
						style={{
							border: '1px solid black',
							backgroundColor: 'white',
							borderRadius: '50%',
							height: 8,
							width: 8,
						}}
					/>
					<div
						style={{
							border: '1px solid black',
							backgroundColor: 'white',
							borderRadius: 3,
							height: 8,
							width: 'auto',
							flex: 1,
						}}
					/> */}
				</FlexRow>
				<FlexRow
					style={{
						padding: 8,
						boxSizing: 'border-box',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<Paragraph
						color="white"
						style={{ flex: 1, textAlign: 'center' }}
					>
						{displayName}
					</Paragraph>
					{modable && (
						<FlexRow style={{ alignItems: 'center' }}>
							<IconButton
								color="white"
								Icon={NotepadIcon}
								onClick={() => {
									dispatch({
										type: types.customizeSchema,
										data: {
											mode: 'customize',
											schema: name,
										},
									})
								}}
							/>
							<IconButton
								color="white"
								Icon={CloseIcon}
								onClick={() => setFormMode('delete')}
							/>
						</FlexRow>
					)}
				</FlexRow>
			</NodeContainer>
		</>
	)
}

export default PaletteItem
