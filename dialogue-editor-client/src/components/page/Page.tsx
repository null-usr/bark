import React from 'react'
import { ReactFlowProvider } from 'react-flow-renderer'
import Workspace from './workspace/Workspace'
import Header from './header/Header'
import { PageContainer } from './styles'
import { FlowProvider } from '../../contexts/FlowContext'

function Page() {
    return (
        <FlowProvider>
            <ReactFlowProvider>
                <PageContainer>
                    <Header />
                    <Workspace />
                </PageContainer>
            </ReactFlowProvider>
        </FlowProvider>
    )
}

export default Page
