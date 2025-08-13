import React, { useState } from 'react'
import { FlexColumn, FlexRow, Grid } from './components/styles'
import { ImageContainer } from './components/ImageContainer'
import { H1 } from './components/Typography/headers'
import { Paragraph } from './components/Typography/text'
import Modal from './components/modal/Modal'

const UsagePage: React.FC<{ onClose: () => void }> = ({ onClose }) => {
	const [page, setPage] = useState(0)
	return (
		<Modal isOpen close={onClose} withDimmer>
			<div
				style={{
					width: '80vw',
					height: '80vh',
					backgroundColor: 'white',
					padding: 32,
					overflowY: 'auto',
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
									dialogue for games, but more generally, it
									is a relational JSON editor.
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
											JSON using [ Scene &gt; Export ]
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
									<button
										className="btn-secondary"
										onClick={() => setPage(1)}
									>
										Details on Usage in a Project
									</button>
								</div>
							</FlexColumn>
						</FlexColumn>
					</>
				)}
				{page === 1 && (
					<FlexColumn
						style={{
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
								project. For example, you can go to [ Workspace
								&gt; Settings ] and define a custom variable
								'Characters' and its options in order to have a
								finite list of known characters to choose from.
							</Paragraph>
							<Paragraph>
								You can then save and load both Workspaces files
								( *.bark ) and individual Scene ( *.dlg ) files
								while you develop and then when you're ready to
								use them in a project you can export them to
								JSON, where an exported Workspace batch exports
								the individual scenes.
							</Paragraph>
							<Paragraph style={{ textAlign: 'center' }}>
								The exported JSON files have two root elements
								<b>"nodes"</b> and <b>"edges"</b> with the
								following structure:
							</Paragraph>
							<FlexRow
								style={{
									justifyContent: 'space-between',
									alignItems: 'center',
								}}
							>
								<Paragraph style={{ textAlign: 'center' }}>
									&#123;
								</Paragraph>
								<img
									width="35%"
									src="node_structure.png"
									alt=""
								/>
								<img
									width="35%"
									src="edge_structure.png"
									alt=""
								/>
								<Paragraph style={{ textAlign: 'center' }}>
									&#125;
								</Paragraph>
							</FlexRow>
						</FlexColumn>
						<Paragraph>
							Each node keeps a list of edge IDs coming in and a
							list of edge IDs leaving its natural target & source
							handles ( "prev" and "next" ) along with "data"
							which contains the list of fields you define. The
							value will either be a string, an integer or an
							array of edge IDs ( in the case of a Data field )
						</Paragraph>
						<Paragraph>
							The default main entry for the nodes is 'root' but
							it can be any source node or any other node ID that
							you know, then generally you don't need to know the
							specific node or edge IDs, simply follow the links
							until there are none left to follow.
						</Paragraph>
						<FlexColumn style={{ alignItems: 'center' }}>
							<div style={{ width: 100 }}>
								<button
									className="btn-secondary w-full"
									onClick={() => setPage(0)}
								>
									Back
								</button>
							</div>
							<div style={{ width: 100 }}>
								<button
									className="btn-primary w-full"
									onClick={() => setPage(2)}
								>
									Next
								</button>
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
									<button
										className="btn-secondary w-full"
										onClick={() => setPage(1)}
									>
										Back
									</button>
								</div>
								<div style={{ width: 100 }}>
									<button
										className="btn-primary w-full"
										onClick={onClose}
									>
										Close
									</button>
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
