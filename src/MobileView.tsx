import React from 'react'
import { ImageContainer } from './components/ImageContainer'
import { FlexColumn, Grid } from './components/styles'
import { H1 } from './components/Typography/headers'

import './App.css'

type Props = {}

const MobileView = (props: Props) => {
	return (
		<div className="Splash">
			<Grid
				style={{
					justifyContent: 'center',
					alignContent: 'center',
					height: '100%',
					width: '100%',
					boxSizing: 'border-box',
					padding: 8,
				}}
			>
				<FlexColumn>
					<div
						style={{
							border: '1px solid black',
							borderRadius: 3,
							alignSelf: 'center',
							width: '100%',
							height: '300px',
						}}
					>
						<ImageContainer
							src="./icon.png"
							width="100%"
							height="100%"
						/>
					</div>
					<H1 style={{ textAlign: 'center', margin: 0 }}>
						Bark Dialogue Editor
					</H1>
					<caption>
						<i>Powered by React Flow</i>
					</caption>
					<caption>
						Thank you very much for your interest in this project,
						but this application is currently unavailable on mobile
						platforms. If you'd like to read more about it, please
						visit{' '}
						<a href="https://nclarke.dev/projects/bark">
							nclarke.dev/bark
						</a>
						, if you'd like to see the source code, check out the{' '}
						<a href="https://github.com/null-usr/bark">
							github repo
						</a>{' '}
						and if you'd like to download the desktop version go to
						itch.io!
					</caption>
				</FlexColumn>
			</Grid>
		</div>
	)
}
export default MobileView
