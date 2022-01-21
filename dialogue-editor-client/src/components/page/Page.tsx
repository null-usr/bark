import React from 'react'
import { ReactFlowProvider } from 'react-flow-renderer'
import Workspace from './workspace/Workspace'
import Toolbar from './header/Toolbar'
import { PageContainer } from './styles'
import { FlowProvider } from '../../contexts/FlowContext'

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
