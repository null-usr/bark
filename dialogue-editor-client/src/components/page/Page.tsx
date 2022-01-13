import React from 'react'
import Workspace from './workspace/Workspace'
import Header from './header/Header'
import { PageContainer } from './styles'

function Page() {
    return (
        <PageContainer>
            <Header />
            <Workspace />
        </PageContainer>
    )
}

export default Page
