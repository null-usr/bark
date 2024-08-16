import React from 'react'
import Workspace from './workspace/Workspace'
import Toolbar from './toolbar/Toolbar'
import { PageContainer } from './styles'

function Page() {
	return (
		<>
			<PageContainer>
				<Toolbar />
				<Workspace />
			</PageContainer>
		</>
	)
}

export default Page
