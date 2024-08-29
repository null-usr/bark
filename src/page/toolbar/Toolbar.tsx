import React, { useState } from 'react'
import { ReactFlowJsonObject, useReactFlow } from 'reactflow'
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import {
	LoadScene,
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
	const { dispatch, reset, workspace, activeScene } = useStore()

	const [formMode, setFormMode] = useState('')

	const fileReader = new FileReader()

	const handleFileRead = (e: any) => {
		const content = fileReader.result

		// originally type workspace but it's more like workspace+
		const data: { workspace?: Workspace } | null = LoadWorkspace(
			content as string
		)

		if (data) {
			// if there's no name, we're loading an exported json
			if (data.workspace) {
				dispatch({ type: types.loadWorkspace, data })
			}
		}
	}

	const handleSceneRead = (e: any) => {
		const content = fileReader.result

		// originally type workspace but it's more like workspace+
		const data: ReactFlowJsonObject | null = LoadScene(content as string)

		if (data) {
			const scene = data as Scene
			if (!scene.name) scene.name = 'Default'
			scene.name = workspace.scenes[scene.name]
				? `${scene.name} (2)`
				: scene.name

			dispatch({ type: types.addScene, data: scene })
			dispatch({ type: types.changeScene, data: scene.name })
		}
	}

	const fileSelector = buildFileSelector()
	const sceneFileSelector = buildFileSelector()

	// once our fileselector changes, we know a file has been selected
	// so we read it
	fileSelector.onchange = (e) => {
		fileReader.onloadend = handleFileRead
		fileReader.readAsText((e.target as HTMLInputElement).files![0])
	}
	// once our fileselector changes, we know a file has been selected
	// so we read it
	sceneFileSelector.onchange = (e) => {
		fileReader.onloadend = handleSceneRead
		fileReader.readAsText((e.target as HTMLInputElement).files![0])
	}

	const saveWorkspace = () => {
		dispatch({
			type: types.saveScene,
			data: undefined,
		})
		// const currentScene: any = reactFlowInstance.toObject()

		// if (activeScene !== null) {
		// 	workspace.scenes[activeScene] = {
		// 		name: activeScene,
		// 		...currentScene,
		// 	}
		// }

		const out = {
			workspace,
			activeScene,
		}

		return JSON.stringify(out, (k, v) =>
			typeof v === 'symbol' ? `$$Symbol:${Symbol.keyFor(v)}` : v
		)
	}
	const exportWorkspace = () => {
		// const serializedScenes = SerializeWorkspace(workspace)
		dispatch({
			type: types.saveScene,
			data: undefined,
		})

		if (navigator.userAgent !== 'Electron') {
			const sceneKeys = Object.keys(workspace.scenes)
			const zip = new JSZip()

			sceneKeys.forEach((scene) => {
				zip.file(
					`${scene}.json`,
					JSON.stringify(workspace.scenes[scene])
				)
			})

			zip.generateAsync({ type: 'blob' }).then((content) => {
				FileSaver.saveAs(
					content,
					workspace.name ? `${workspace.name}.zip` : 'download.zip'
				)
			})

			return ''
		} else {
			const sceneKeys = Object.keys(workspace.scenes)
			const out: any[] = []
			sceneKeys.forEach((scene) => {
				out.push(workspace.scenes[scene])
			})
			return JSON.stringify(out)
		}
	}

	const onSaveWorkspace = () => {
		// const flow = reactFlowInstance.toObject()
		// const out = SaveScene(flow)

		dispatch({
			type: types.saveScene,
			data: undefined,
		})

		const out = saveWorkspace()

		const blob = new Blob([out], { type: 'application/json' })
		const href = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = href
		link.download = `${workspace.name ? workspace.name : activeScene}.bark`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const onWorkspaceExport = () => {
		exportWorkspace()
	}

	const onSceneExport = () => {
		dispatch({
			type: types.saveScene,
			data: undefined,
		})

		const out = SerializeScene(workspace.scenes[activeScene])

		const blob = new Blob([out], { type: 'application/json' })
		const href = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = href
		link.download = `${activeScene}.woof`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	// load our initial elemnets up
	const onNewWorkspace = (name: string) => {
		// reset()
		// setViewport({ x: 100, y: 100, zoom: 1 })
		fitView()
		dispatch({ type: types.createWorkspace, data: { workspaceName: name } })
	}

	// load our initial elemnets up
	const onResetWorkspace = () => {
		reset()
		setViewport({ x: 100, y: 100, zoom: 1 })
		fitView()
	}

	const handleFileSelect = () => {
		fileSelector.click()
	}
	const handleSceneFileSelect = () => {
		sceneFileSelector.click()
	}

	// ELECTRON =======================================================
	// @ts-ignore
	if (window.ipcRenderer) {
		// @ts-ignore
		window.ipcRenderer.on('workspace:new', () => {
			setFormMode('newWorkspace')
		})

		// @ts-ignore
		window.ipcRenderer.on('workspace:edit', () => {
			setFormMode('edit')
		})

		// @ts-ignore
		window.ipcRenderer.on('workspace:open', (data) => {
			// originally type workspace but it's more like workspace+
			const ws: { workspace?: Workspace } | null = LoadWorkspace(
				data as string
			)

			if (ws) {
				// if there's no name, we're loading an exported json
				if (ws.workspace) {
					dispatch({ type: types.loadWorkspace, data: ws })
				}
			}
		})

		// @ts-ignore
		window.ipcRenderer.on('scene:open', (data) => {
			handleSceneRead(data)
		})

		// saveWorkspace
		// @ts-ignore
		window.ipcRenderer.on('workspace:saveWorkspace', (data) => {
			const out = { path: data.path, data: saveWorkspace() }

			// send the stringified content up and out to electron's main.ts
			// @ts-ignore
			window.ipcRenderer.send('window:write', out)
		})

		// exportJSON
		// @ts-ignore
		window.ipcRenderer.on('workspace:exportJSON', (data) => {
			const out = { path: data.path, data: exportWorkspace() }

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
						<ToolbarButton label="Workspace">
							<Button
								type="subtle"
								block
								onClick={() => setFormMode('newWorkspace')}
							>
								New Workspace
							</Button>
							<Button
								type="subtle"
								block
								onClick={handleFileSelect}
							>
								Open
							</Button>
							<Button
								type="subtle"
								block
								onClick={() => setFormMode('edit')}
							>
								Edit Workspace
							</Button>
							<Button
								type="subtle"
								block
								onClick={onSaveWorkspace}
							>
								Save Workspace
							</Button>
							<Button
								type="subtle"
								block
								onClick={onWorkspaceExport}
							>
								Export Project
							</Button>
						</ToolbarButton>
						<ToolbarButton label="Scene">
							{/* <Button type="subtle" block onClick={onNew}>
								New Scene
							</Button> */}
							<Button
								type="subtle"
								block
								onClick={handleSceneFileSelect}
							>
								Load Scene
							</Button>
							<Button type="subtle" block onClick={onSceneExport}>
								Export Scene
							</Button>
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
