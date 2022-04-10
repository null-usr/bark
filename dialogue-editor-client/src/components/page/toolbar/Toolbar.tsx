import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ReactFlowJsonObject, useReactFlow } from 'react-flow-renderer'
import { FlowContext } from '../../../contexts/FlowContext'
import { Dropdown } from '../../dropdown/Dropdown'
import { HeaderContainer, LeftButtonGroup, RightButtonGroup } from './styles'
import initialElements from '../workspace/canvas/initial-elements'
import {
	LoadScene,
	SaveScene,
	SerializeScene,
} from '../../../helpers/serialization'

// create an input which we then call click upon
function buildFileSelector() {
	const fileSelector = document.createElement('input')
	fileSelector.setAttribute('type', 'file')
	fileSelector.setAttribute('multiple', 'multiple')
	return fileSelector
}

function Toolbar() {
	const fileReader = new FileReader()
	const rFlow = useContext(FlowContext)

	const handleFileRead = (e: any) => {
		const content = fileReader.result
		const flow: ReactFlowJsonObject | null = LoadScene(content as string)

		if (flow) {
			rFlow.reactFlowInstance?.setEdges(flow.edges)
			rFlow.reactFlowInstance?.setNodes(flow.nodes)
			rFlow.reactFlowInstance?.setViewport(flow.viewport)
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
		if (rFlow.reactFlowInstance) {
			const flow = rFlow.reactFlowInstance.toObject()

			const out = SaveScene(flow)

			const blob = new Blob([out], { type: 'application/json' })
			const href = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = href
			link.download = 'file.json'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}, [rFlow.reactFlowInstance])

	const onExport = () => {
		if (rFlow.reactFlowInstance) {
			const out = SerializeScene(rFlow.reactFlowInstance.toObject())

			const blob = new Blob([out], { type: 'application/json' })
			const href = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = href
			link.download = 'file.json'
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		}
	}

	// load our initial elemnets up
	const onNew = () => {
		rFlow.reactFlowInstance?.setNodes(initialElements)
		rFlow.reactFlowInstance?.setViewport({ x: 100, y: 100, zoom: 1 })
		rFlow.reactFlowInstance?.fitView()
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
