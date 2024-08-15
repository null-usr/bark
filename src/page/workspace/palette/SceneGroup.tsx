import React from 'react'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { FlexColumn, FlexRow } from '@/components/styles'
import IconButton from '@/components/Button/IconButton'
import { Paragraph } from '@/components/Typography/text'
import NotepadIcon from '@/components/Icons/Notepad'
import CloseIcon from '@/components/Icons/Close'
import { SceneContainer } from './styles'

const SceneGroup: React.FC<{
	data: string[]
	activeScene?: string | null
	onEdit: (a: string) => void
}> = ({ data, activeScene, onEdit }) => {
	const { dispatch } = useStore()
	return (
		<div
			style={{
				overflowY: 'auto',
				overflowX: 'hidden',
			}}
		>
			<FlexColumn>
				{data.map((s) => {
					return (
						<SceneContainer
							key={s}
							onClick={
								s === activeScene
									? undefined
									: () => {
											dispatch({
												type: types.changeScene,
												data: s,
											})
									  }
							}
							active={activeScene === s}
						>
							<Paragraph
								color="white"
								style={{ flex: 1, textAlign: 'center' }}
							>
								{s}
							</Paragraph>
							{activeScene !== s && (
								<FlexRow style={{ alignItems: 'center' }}>
									<IconButton
										background="black"
										color="white"
										radius="3px"
										width={32}
										Icon={NotepadIcon}
										onClick={
											activeScene === s
												? undefined
												: (e) => {
														e.stopPropagation()
														onEdit(
															`renameScene-${s}`
														)
												  }
										}
										key={s}
									/>
									<IconButton
										Icon={CloseIcon}
										background="black"
										color="white"
										radius="3px"
										width={32}
										onClick={
											activeScene === s
												? undefined
												: (e) => {
														e.stopPropagation()
														onEdit(
															`deleteScene-${s}`
														)
												  }
										}
										key={s}
									/>
								</FlexRow>
							)}
						</SceneContainer>
					)
				})}
			</FlexColumn>
		</div>
	)
}

export default SceneGroup
