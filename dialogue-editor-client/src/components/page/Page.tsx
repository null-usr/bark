import React from 'react'
import { ReactFlowProvider } from 'reactflow'
import { FlowProvider } from '@/contexts/FlowContext'
import Workspace from './workspace/Workspace'
import Toolbar from './toolbar/Toolbar'
import { PageContainer } from './styles'

// overwrite default node stylings, see "Theming" on docs page
import './Page.css'

function Page() {
	return (
		<PageContainer>
			<ReactFlowProvider>
				{/* Only render the toolbar if we're not in the electron app */}
				{navigator.userAgent !== 'Electron' && <Toolbar />}
				<Workspace />
			</ReactFlowProvider>
		</PageContainer>
	)
}

export default Page
