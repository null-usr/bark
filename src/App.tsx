import React, { useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import Page from './page/Page'
import './App.css'
// overwrite default node stylings, see "Theming" on docs page
import '@/helpers/style.css'
import { AppContainer } from './styles'
import useStore from './store/store'

function App() {
	const { theme, setTheme } = useStore()

	useEffect(() => {
		async function loadTheme() {
			fetch('./theme.json')
				.then((response) => response.json())
				.then((d) => {
					setTheme(d)
				})
		}

		loadTheme()
	}, [])
	return (
		<>
			{theme && (
				<ThemeProvider theme={theme}>
					<ReactFlowProvider>
						<AppContainer>
							<Page />
						</AppContainer>
					</ReactFlowProvider>
				</ThemeProvider>
			)}
		</>
	)
}

export default App
