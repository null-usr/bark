import React, { useState } from 'react'
import { useReactFlow } from 'reactflow'
import {
	LoadWorkspace,
	SerializeScene,
} from '@/helpers/serialization/serialization'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { Scene, Workspace } from '@/helpers/types'
import CreateWorkspace from '@/components/forms/workspace/CreateWorkspace'
import Modal from '@/components/modal/Modal'
import EditWorkspace from '@/components/forms/workspace/EditWorkspace'
import Button from '@/components/Button/Button'
import SplashPage from '@/SplashPage'
import { HeaderContainer, LeftButtonGroup, RightButtonGroup } from './styles'
import { ToolbarButton } from './ToolbarButton'

// create an input which we then call click upon
function buildFileSelector() {
	const fileSelector = document.createElement('input')
	fileSelector.setAttribute('type', 'file')
	fileSelector.setAttribute('multiple', 'multiple')
	return fileSelector
}

function Toolbar() {
	const { setViewport, fitView } = useReactFlow()
	const reactFlowInstance = useReactFlow()
	const { nodes, setNodes, setEdges, edges, workspace, activeScene } =
		useStore()

	const reset = useStore((state) => state.reset)
	const dispatch = useStore((store) => store.dispatch)

	const [formMode, setFormMode] = useState('')

	const fileReader = new FileReader()

	const handleFileRead = (e: any) => {
		const content = fileReader.result

		// originally type workspace but it's more like workspace+
		const data: Workspace | null = LoadWorkspace(content as string)

		if (data) {
			// if there's no name, we're loading an exported json
			if (!data.name) {
				// @ts-ignore
				const scene = data as Scene
				scene.name = 'Default'
				dispatch({ type: types.setNodes, data: scene.nodes })
				dispatch({ type: types.setEdges, data: scene.edges })
				setViewport(scene.viewport)
			} else {
				dispatch({ type: types.loadWorkspace, data })
			}
		}
	}

	const fileSelector = buildFileSelector()

	// once our fileselector changes, we know a file has been selected
	// so we read it
	fileSelector.onchange = (e) => {
		fileReader.onloadend = handleFileRead
		fileReader.readAsText((e.target as HTMLInputElement).files![0])
	}

	const save = () => {
		let currentScene: any = reactFlowInstance.toObject()

		// if our activeScene isn't null, then we can discard current
		// for the next part
		if (activeScene !== null) {
			workspace.scenes[activeScene] = {
				name: activeScene,
				...currentScene,
			}
			currentScene = {}
		}
		// const w = SaveWorkspace(workspace)

		const out = {
			workspace,
			activeScene,
			...currentScene,
		}

		return JSON.stringify(out, (k, v) =>
			typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
		)
	}

	const onSave = () => {
		// const flow = reactFlowInstance.toObject()
		// const out = SaveScene(flow)

		const out = save()

		const blob = new Blob([out], { type: 'application/json' })
		const href = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = href
		link.download = `${workspace.name ? workspace.name : 'file'}.json`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const onExport = () => {
		const out = SerializeScene(reactFlowInstance.toObject())

		const blob = new Blob([out], { type: 'application/json' })
		const href = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = href
		link.download = 'file.json'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	// load our initial elemnets up
	const onNewWorkspace = (name: string) => {
		reset()
		setViewport({ x: 100, y: 100, zoom: 1 })
		fitView()
		dispatch({ type: types.createWorkspace, data: { workspaceName: name } })
	}

	// load our initial elemnets up
	const onNew = () => {
		reset()
		setViewport({ x: 100, y: 100, zoom: 1 })
		fitView()
	}

	const handleFileSelect = () => {
		fileSelector.click()
	}

	// ELECTRON =======================================================
	// @ts-ignore
	if (window.ipcRenderer) {
		// @ts-ignore
		window.ipcRenderer.on('window:new', () => {
			onNew()
		})

		// @ts-ignore
		window.ipcRenderer.on('workspace:new', () => {
			setFormMode('newWorkspace')
		})

		// @ts-ignore
		window.ipcRenderer.on('workspace:edit', () => {
			setFormMode('edit')
		})

		// saveWorkspace
		// @ts-ignore
		window.ipcRenderer.on('workspace:saveWorkspace', (data) => {
			const out = { path: data.path, data: save() }

			// send the stringified content up and out to electron's main.ts
			// @ts-ignore
			window.ipcRenderer.send('window:write', out)
		})

		// exportJSON
		// @ts-ignore
		window.ipcRenderer.on('workspace:saveJSON', (data) => {
			const out = { path: data.path, data: save() }

			// send the stringified content up and out to electron's main.ts
			// @ts-ignore
			window.ipcRenderer.send('window:write', out)
		})

		// successful or failed writes, have a modal for this
		// @ts-ignore
		window.ipcRenderer.on('window:writeSuccess', () => {
			console.log('successful write')
		})
		// @ts-ignore
		window.ipcRenderer.on('window:writeFailed', () => {
			console.log('failed write')
		})
	}

	return (
		<>
			{formMode === 'newWorkspace' && (
				<CreateWorkspace
					cancel={() => setFormMode('')}
					submit={(name) => {
						onNewWorkspace(name)
						setFormMode('')
					}}
				/>
			)}
			{formMode === 'edit' && (
				<EditWorkspace
					name={workspace.name}
					submit={(name) => {
						dispatch({
							type: types.renameWorkspace,
							data: { newName: name },
						})
						setFormMode('')
					}}
					cancel={() => setFormMode('')}
				/>
			)}
			{formMode === 'about' && (
				<Modal
					close={() => setFormMode('')}
					title="About"
					open
					withDimmer
				>
					<div style={{ width: 600, height: 600 }}>
						<SplashPage />
					</div>
				</Modal>
			)}
			{/* Only render the visible toolbar if we're not in the electron app */}
			{navigator.userAgent !== 'Electron' && (
				<HeaderContainer>
					<LeftButtonGroup style={{ gap: 0 }}>
						<ToolbarButton label="File">
							<Button type="subtle" block onClick={onNew}>
								New File
							</Button>
							<Button
								type="subtle"
								block
								onClick={handleFileSelect}
							>
								Open
							</Button>
							<Button type="subtle" block onClick={onSave}>
								Save
							</Button>
							<Button type="subtle" block onClick={onExport}>
								Export
							</Button>
						</ToolbarButton>
						<ToolbarButton label="Workspace">
							<Button
								type="subtle"
								block
								onClick={() => setFormMode('newWorkspace')}
							>
								New Workspace
							</Button>
							{workspace.name !== null && (
								<Button
									type="subtle"
									block
									onClick={() => setFormMode('edit')}
								>
									Edit Workspace
								</Button>
							)}
						</ToolbarButton>
						<ToolbarButton label="Help">
							<Button
								type="subtle"
								block
								onClick={() => setFormMode('about')}
							>
								About
							</Button>
						</ToolbarButton>
					</LeftButtonGroup>
					{/* don't really have anything for this atm */}
					{/* <RightButtonGroup>
					<button>Quit</button>
				</RightButtonGroup> */}
				</HeaderContainer>
			)}
		</>
	)
}

export default Toolbar
