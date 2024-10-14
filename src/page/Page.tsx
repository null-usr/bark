import React, { useEffect } from 'react'
import UsagePage from '@/UsagePage'
import useStore from '@/store/store'
import Workspace from './workspace/Workspace'
import Toolbar from './toolbar/Toolbar'
import { PageContainer } from './styles'

function Page() {
	const { showUsage, setShowUsage } = useStore()

	useEffect(() => {
		// @ts-ignore
		if (window.ipcRenderer) {
			// @ts-ignore
			window.ipcRenderer.on('window:showUsage', () => {
				setShowUsage(true)
			})
		}
	}, [])

	useEffect(() => {
		// we're on desktop
		if (navigator.userAgent !== 'electron') {
			const usageShown = localStorage.getItem('showUsage')
			if (usageShown !== 'shown') {
				setShowUsage(true)
			}
		}
	}, [])

	return (
		<>
			<UsagePage
				open={showUsage}
				onClose={() => {
					localStorage.setItem('showUsage', 'shown')
					setShowUsage(false)
				}}
			/>
			<PageContainer>
				<Toolbar />
				<Workspace />
			</PageContainer>
		</>
	)
}

export default Page
