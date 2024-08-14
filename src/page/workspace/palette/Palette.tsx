import React, { useState } from 'react'
import { Paragraph } from '@/components/Typography/text'
import { FlexColumn } from '@/components/styles'
import Button from '@/components/Button/Button'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import NodeGroup from './NodeGroup'
import { PaletteContainer, TabLink } from './styles'
import SceneGroup from './SceneGroup'

const Palette: React.FC<{
	setFormMode: (mode: string) => void
}> = ({ setFormMode }) => {
	const {
		builtInNodes: builtIn,
		customNodes: custom,
		workspace,
		activeScene,
		dispatch,
	} = useStore()
	const workspaceScenes = Object.keys(workspace.scenes)
	const [paletteMode, setPaletteMode] = useState<'nodes' | 'scenes'>('nodes')
	return (
		<PaletteContainer>
			<Paragraph style={{ padding: '8px 0px' }} color="whtie">
				Workspace: {workspace.name ? workspace.name : 'NONE'}
			</Paragraph>
			<div style={{ marginBottom: 16 }}>
				<TabLink
					active={paletteMode === 'nodes'}
					onClick={() => setPaletteMode('nodes')}
				>
					Nodes
				</TabLink>
				<TabLink
					active={paletteMode === 'scenes'}
					onClick={() => setPaletteMode('scenes')}
				>
					Scenes
				</TabLink>
			</div>
			{/* nodes/scenes container */}
			<div style={{ padding: 8, minHeight: 0 }}>
				{paletteMode === 'nodes' && (
					<FlexColumn style={{ height: '100%' }}>
						<div className="description">
							You can drag these nodes to the pane on the right.
						</div>
						<Button
							type="secondary"
							onClick={() => {
								dispatch({
									type: types.customizeSchema,
									data: {
										mode: 'customize',
										schema: null,
									},
								})
							}}
							// block
						>
							Create Node
						</Button>
						<NodeGroup title="Basic Nodes" data={builtIn} />
						<NodeGroup
							title="Wrokspace Nodes"
							data={workspace.schemas}
							modable
						/>
					</FlexColumn>
				)}
				{paletteMode === 'scenes' && (
					<FlexColumn>
						<Button
							type="secondary"
							onClick={() => setFormMode('createScene')}
						>
							New Scene
						</Button>
						<SceneGroup
							data={workspaceScenes}
							activeScene={activeScene}
							onEdit={setFormMode}
						/>
					</FlexColumn>
				)}
			</div>
		</PaletteContainer>
	)
}

export default Palette
