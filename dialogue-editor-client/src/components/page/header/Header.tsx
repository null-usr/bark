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

function buildFileSelector() {
    const fileSelector = document.createElement('input')
    fileSelector.setAttribute('type', 'file')
    fileSelector.setAttribute('multiple', 'multiple')
    return fileSelector
}

function Header() {
    const fileReader = new FileReader()
    const nodes = useStoreState((store) => store.nodes)
    // const [elements, setElements] = useState(null)
    const rFlow = useContext(FlowContext)
    const { transform } = useZoomPanHelper()

    useEffect(() => {
        console.log('elements updated to:')
        console.log(rFlow.elements)
    }, [rFlow.elements])

    // const onRestore = useCallback(() => {
    //     const restoreFlow = async () => {
    //         // const flow: FlowExportObject | null = await localStorage.getItem(flowKey);
    //         // if (flow) {
    //         //   const [x = 0, y = 0] = flow.position;
    //         //   setElements(flow.elements || []);
    //         //   transform({ x, y, zoom: flow.zoom || 0 });
    //         // }
    //     }

    //     restoreFlow()
    // }, [setElements, transform])

    const handleFileRead = (e: any) => {
        const content = fileReader.result
        const flow: FlowExportObject | null = JSON.parse(content as string)

        // need to access the setElements of our canvas somehow
        if (flow) {
            const [x = 0, y = 0] = flow.position
            // rFlow.setElements(flow.elements || [])

            for (let index = 0; index < flow.elements.length; index++) {
                if (flow.elements[index].data) {
                    flow.elements[index].data.label.$$typeof =
                        Symbol.for('react.element')
                }
            }
            console.log(flow.elements)
            rFlow.setElements(flow.elements)
            transform({ x, y, zoom: flow.zoom || 0 })
        }
    }

    const fileSelector = buildFileSelector()
    fileSelector.onchange = (e) => {
        fileReader.onloadend = handleFileRead
        fileReader.readAsText((e.target as HTMLInputElement).files![0])
    }

    const onSave = useCallback(() => {
        if (rFlow.reactFlowInstance) {
            const flow = rFlow.reactFlowInstance.toObject()

            const out = JSON.stringify(flow)

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
                    <button onClick={onSave}>Download</button>
                    <button>Close</button>
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

export default Header
