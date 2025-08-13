import React from 'react'
import './App.css'
// overwrite default node stylings, see "Theming" on docs page
// import '@/helpers/style.css'
import { FlexColumn, Grid } from './components/styles'
import { ImageContainer } from './components/ImageContainer'
import { H1 } from './components/Typography/headers'

// import { shell } from 'electron' //dev dependancy

function App() {
	return (
		<div className="Splash">
			<Grid
				style={{
					justifyContent: 'center',
					alignContent: 'center',
					height: '100%',
				}}
			>
				<FlexColumn>
					<div
						style={{
							border: '1px solid black',
							borderRadius: 3,
							alignSelf: 'center',
						}}
					>
						<ImageContainer
							src="./icon.png"
							width="400px"
							height="400px"
						/>
					</div>
					<H1 style={{ textAlign: 'center', margin: 0 }}>
						Bark Dialogue Editor
					</H1>
					<caption>
						<i>Powered by React Flow</i>
					</caption>
					{/* <Paragraph style={{ textAlign: 'center' }}>
						Bark is a dialogue editor built using React and a
						library called{' '}
						<a href="https://reactflow.dev/">react flow</a>.
					</Paragraph> */}
					{/* <FlexRow style={{ justifyContent: 'center' }}>
						<button className="btn-primary"
							onClick={() =>
								shell.openExternal(
									'https://github.com/null-usr/bark/releases'
								)
							}
							type="secondary"
						>
							Offline Version
						</button>
						<button className="btn-primary" type="secondary">Bla bla</button>
					</FlexRow> */}
				</FlexColumn>
			</Grid>
		</div>
	)
}

export default App
