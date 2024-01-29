import React, { useEffect, useState } from 'react'
import { Schema } from '@/helpers/types'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import PaletteItem from './PaletteItem'
import { Group, SceneContainer } from './styles'

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
					style={{
						background: '#ccc',
						cursor: 'not-allowed',
						borderColor: 'black',
					}}
				>
					default
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
						{s}
						{activeScene !== s && (
							<>
								<button
									onClick={
										activeScene === s
											? undefined
											: (e) => {
													e.stopPropagation()
													onEdit(`renameScene-${s}`)
											  }
									}
									key={s}
								>
									O
								</button>
								<button
									onClick={
										activeScene === s
											? undefined
											: (e) => {
													e.stopPropagation()
													onEdit(`deleteScene-${s}`)
											  }
									}
									key={s}
								>
									X
								</button>
							</>
						)}
					</SceneContainer>
				)
			})}
		</>
	)
}

export default SceneGroup
