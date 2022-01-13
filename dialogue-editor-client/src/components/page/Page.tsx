import React from 'react'
import Workspace from './workspace/Workspace'
import Header from './header/Header'
import { PageContainer } from './styles'

interface Props {
	
}

const Page = (props: Props) => {
	return (
		<PageContainer>
			<Header></Header>
			<Workspace />
		</PageContainer>
	)
}

export default Page