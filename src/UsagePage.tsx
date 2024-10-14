import React, { useState } from 'react'
import { FlexColumn, FlexRow, Grid } from './components/styles'
import { ImageContainer } from './components/ImageContainer'
import { H1 } from './components/Typography/headers'
import Button from './components/Button/Button'
import { Paragraph } from './components/Typography/text'
import Modal from './components/modal/Modal'

const UsagePage: React.FC<{ open: boolean; onClose: () => void }> = ({
	open,
	onClose,
}) => {
	const [page, setPage] = useState(0)
	return (
		<Modal isOpen={open} close={onClose} withDimmer>
			<div
				style={{
					width: '50vw',
					height: '75vh',
					backgroundColor: 'white',
					padding: 32,
					// height: '100%',
				}}
			>
				{page === 0 && (
					<>
						<FlexColumn
							style={{
								alignItems: 'center',
								gap: 16,
								height: '100%',
								justifyContent: 'space-between',
							}}
						>
							<FlexColumn style={{ textAlign: 'center' }}>
								<div
									style={{
										border: '1px solid black',
										borderRadius: 3,
										alignSelf: 'center',
									}}
								>
									<ImageContainer
										src="./icon.png"
										width="200px"
										height="200px"
									/>
								</div>
								<FlexColumn style={{ gap: 0 }}>
									<H1
										style={{
											textAlign: 'center',
											margin: 0,
										}}
									>
										Welcome to the Bark Dialogue Editor
									</H1>
									<caption>
										<i>Powered by React Flow</i>
									</caption>
								</FlexColumn>
								<caption>
									This is a tool designed to visually edit
									dialogue for games, but more generally
									relational JSON editor.
								</caption>
							</FlexColumn>
							<FlexColumn style={{ gap: 16 }}>
								<Paragraph style={{ textAlign: 'center' }}>
									Basic Controls & Features:
								</Paragraph>
								<FlexColumn style={{ gap: 0 }}>
									<caption>
										<i>
											shift + left click + drag to
											multi-select
										</i>
									</caption>
									<caption>
										<i>
											drag a node handle into an empty
											space to create a new node
										</i>
									</caption>

									<caption>
										<i>
											Drag a node onto an existing edge's
											[v] to insert it ( including from
											the palette )
										</i>
									</caption>
									<caption>
										<i>
											You can export a single scene to
											json using [ Scene &gt; Export ]
											instead of [ Workspace &gt; Export ]
										</i>
									</caption>
									<caption>
										<i>You can store data in edges</i>
									</caption>
									<caption>
										<i>
											Use source nodes as entry-points for
											exported JSON files
										</i>
									</caption>
								</FlexColumn>
							</FlexColumn>
							<FlexColumn style={{ justifyContent: 'center' }}>
								<div>
									<Button
										type="secondary"
										onClick={() => setPage(1)}
									>
										Details on Usage in a Project
									</Button>
								</div>
							</FlexColumn>
						</FlexColumn>
					</>
				)}
				{page === 1 && (
					<FlexColumn
						style={{
							height: '100%',
							alignItems: 'center',
							gap: 16,
							justifyContent: 'space-between',
						}}
					>
						<FlexColumn>
							<Paragraph style={{ textAlign: 'center' }}>
								A <b>Workspace</b> is a collection of{' '}
								<b>Scenes</b> and Workspace utilities ( custom
								nodes & variables ) to help organize your
								project.
							</Paragraph>
							<Paragraph>
								You can save and load both Workspaces files (
								*.bark ) and individual Scene ( *.dlg ) files
								while you develop and then when you're ready to
								use them in a project you can export them to
								json, where an exported Workspace batch exports
								the individual scenes.
							</Paragraph>
							<Paragraph style={{ textAlign: 'center' }}>
								The exported json files have the following
								structure:
							</Paragraph>
							<Paragraph style={{ textAlign: 'center' }}>
								&#123; ... ... &#125;
							</Paragraph>
						</FlexColumn>
						<FlexColumn style={{ alignItems: 'center' }}>
							<div style={{ width: 100 }}>
								<Button
									block
									type="secondary"
									onClick={() => setPage(0)}
								>
									Back
								</Button>
							</div>
							<div style={{ width: 100 }}>
								<Button block onClick={() => setPage(2)}>
									Next
								</Button>
							</div>
						</FlexColumn>
					</FlexColumn>
				)}
				{page === 2 && (
					<FlexColumn
						style={{
							height: '100%',
							alignItems: 'center',
							gap: 16,
							justifyContent: 'center',
						}}
					>
						<FlexColumn>
							<Paragraph style={{ textAlign: 'center' }}>
								You're currently using the web version of Bark
								but if you'd like to use it offline, you can
								download the exe on itch.io!
							</Paragraph>
							<Paragraph style={{ textAlign: 'center' }}>
								Have fun!
							</Paragraph>
							<FlexColumn style={{ alignItems: 'center' }}>
								<div style={{ width: 100 }}>
									<Button
										block
										type="secondary"
										onClick={() => setPage(1)}
									>
										Back
									</Button>
								</div>
								<div style={{ width: 100 }}>
									<Button block onClick={onClose}>
										Close
									</Button>
								</div>
							</FlexColumn>
						</FlexColumn>
					</FlexColumn>
				)}
			</div>
		</Modal>
	)
}

export default UsagePage
