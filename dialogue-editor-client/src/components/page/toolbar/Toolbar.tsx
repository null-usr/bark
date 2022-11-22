import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
	ReactFlowJsonObject,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from 'reactflow'
import { FlowContext } from '../../../contexts/FlowContext'
import { Dropdown } from '../../dropdown/Dropdown'
import { HeaderContainer, LeftButtonGroup, RightButtonGroup } from './styles'
import initialElements from '../../../helpers/initial-elements'
import {
	LoadScene,
	SaveScene,
	SerializeScene,
} from '../../../helpers/serialization'
import useStore from '../../../store/store'

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
	const { nodes, setNodes, setEdges, edges } = useStore()

	const reset = useStore((state) => state.reset)

	const fileReader = new FileReader()

	const handleFileRead = (e: any) => {
		const content = fileReader.result
		const flow: ReactFlowJsonObject | null = LoadScene(content as string)

		if (flow) {
			setEdges(flow.edges)
			setNodes(flow.nodes)
			setViewport(flow.viewport)
		}
	}

	const fileSelector = buildFileSelector()

	// once our fileselector changes, we know a file has been selected
	// so we read it
	fileSelector.onchange = (e) => {
		fileReader.onloadend = handleFileRead
		fileReader.readAsText((e.target as HTMLInputElement).files![0])
	}

	const onSave = useCallback(() => {
		const flow = reactFlowInstance.toObject()

		const out = SaveScene(flow)

		const blob = new Blob([out], { type: 'application/json' })
		const href = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = href
		link.download = 'file.json'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}, [reactFlowInstance])

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
	const onNew = () => {
		reset()
		setViewport({ x: 100, y: 100, zoom: 1 })
		fitView()
	}

	const handleFileSelect = (e: { preventDefault: () => void }) => {
		e.preventDefault()
		fileSelector.click()
	}

	return (
		<HeaderContainer>
			<LeftButtonGroup>
				<Dropdown label="File">
					<button onClick={onNew}>New</button>
					<button onClick={handleFileSelect}>Open</button>
					<button onClick={onSave}>Save</button>
					<button onClick={onExport}>Export</button>
					<div>File 3</div>
				</Dropdown>
				<button>Edit</button>
				<button>Help</button>
			</LeftButtonGroup>
			<RightButtonGroup>
				<button>Quit</button>
			</RightButtonGroup>
		</HeaderContainer>
	)
}

export default Toolbar
