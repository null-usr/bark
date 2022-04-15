import React from 'react'
import { ReactFlowProvider } from 'react-flow-renderer'
import Workspace from './workspace/Workspace'
import Toolbar from './toolbar/Toolbar'
import { PageContainer } from './styles'
import { FlowProvider } from '../../contexts/FlowContext'

// overwrite default node stylings, see "Theming" on docs page
import './Page.css'

function Page() {
	return (
		<FlowProvider>
			<ReactFlowProvider>
				<PageContainer>
					<Toolbar />
					<Workspace />
				</PageContainer>
			</ReactFlowProvider>
		</FlowProvider>
	)
}

export default Page
