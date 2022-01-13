import React from 'react'
import Canvas from './canvas/Canvas';
import Palette from './palette/Palette';
import { WorkspaceContainer } from './styles'


const Workspace: React.FC<{}> = (props) => {
	return (
		<WorkspaceContainer>
			<Palette>
				<div>
					I'm a palette item!
				</div>
				<div>
					Wow, that's crazy! same :)
				</div>
			</Palette>
			<Canvas />
		</WorkspaceContainer>
	)
}

export default Workspace;
