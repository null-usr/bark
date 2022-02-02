import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
    useStoreState,
    useStoreActions,
    FlowExportObject,
    useZoomPanHelper,
} from 'react-flow-renderer'
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
    const { transform } = useZoomPanHelper()

    const handleFileRead = (e: any) => {
        const content = fileReader.result
        const flow: FlowExportObject | null = LoadScene(content as string)

        if (flow) {
            const [x = 0, y = 0] = flow.position
            rFlow.setElements(flow.elements)
            transform({ x, y, zoom: flow.zoom || 0 })
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
            const out = SerializeScene(rFlow)

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
        rFlow.setElements(initialElements)
        transform({ x: 0, y: 0, zoom: 1 })
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
