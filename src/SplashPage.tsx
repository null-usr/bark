import React from 'react'
import './App.css'
// overwrite default node stylings, see "Theming" on docs page
import '@/helpers/style.css'
import { FlexColumn, Grid } from './components/styles'
import { ImageContainer } from './components/ImageContainer'
import { H1 } from './components/Typography/headers'
import { Caption1 } from './components/Typography/text'

function SplashPage() {
	return (
		<Grid
			style={{
				backgroundColor: 'white',
				justifyContent: 'center',
				alignContent: 'center',
				height: '100%',
			}}
		>
			<FlexColumn>
				<div style={{ border: '1px solid black', borderRadius: 3 }}>
					<ImageContainer
						src="./icon.png"
						width="400px"
						height="400px"
					/>
				</div>
				<H1 style={{ textAlign: 'center', margin: 0 }}>
					Bark Dialogue Editor
				</H1>
				<Caption1>
					<i>Powered by React Flow</i>
				</Caption1>
			</FlexColumn>
		</Grid>
	)
}

export default SplashPage
