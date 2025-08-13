import React from 'react'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { FlexColumn, FlexRow } from '@/components/styles'
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
							className={`${
								activeScene
									? 'text-dark bg-white hover:bg-gray-300'
									: 'text-white bg-dark'
							}`}
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
							<p
								className="font-semibold"
								color="white"
								style={{ flex: 1, textAlign: 'center' }}
							>
								{s}
							</p>
							{activeScene !== s && (
								<FlexRow style={{ alignItems: 'center' }}>
									<button
										className="btn-primary  "
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
									>
										<NotepadIcon />
									</button>
									<button
										className="btn-primary  "
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
									>
										<CloseIcon />
									</button>
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
