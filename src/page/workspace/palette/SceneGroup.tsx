import React, { useEffect, useState } from 'react'
import { Schema } from '@/helpers/types'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { FlexRow } from '@/components/styles'
import IconButton from '@/components/Button/IconButton'
import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg'
import { ReactComponent as EditIcon } from '@/assets/icons/edit.svg'
import { Paragraph } from '@/components/Typography/text'
import { Group, SceneContainer } from './styles'
import PaletteItem from './PaletteItem'

const SceneGroup: React.FC<{
	data: string[]
	activeScene?: string | null
	onEdit: (a: string) => void
}> = ({ data, activeScene, onEdit }) => {
	const { dispatch } = useStore()
	return (
		<>
			{Object.keys(data).length === 0 && (
				<SceneContainer
				// style={{
				// 	background: '#ccc',
				// 	cursor: 'not-allowed',
				// 	borderColor: 'black',
				// }}
				>
					<Paragraph
						color="white"
						style={{ flex: 1, textAlign: 'center' }}
					>
						DEFAULT
					</Paragraph>
				</SceneContainer>
			)}
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
									Icon={EditIcon}
									onClick={
										activeScene === s
											? undefined
											: (e) => {
													e.stopPropagation()
													onEdit(`renameScene-${s}`)
											  }
									}
									key={s}
								/>
								<IconButton
									Icon={CloseIcon}
									onClick={
										activeScene === s
											? undefined
											: (e) => {
													e.stopPropagation()
													onEdit(`deleteScene-${s}`)
											  }
									}
									key={s}
								/>
							</FlexRow>
						)}
					</SceneContainer>
				)
			})}
		</>
	)
}

export default SceneGroup
