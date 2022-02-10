// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context/
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/37023

import React, { createContext, useMemo, useState } from 'react'
import { Elements } from 'react-flow-renderer'

// Move to new folder/find type definition from react-flow
type reactFlowInstance = {
	project: (position: { x: number; y: number }) => { x: number; y: number }
	fitView: (padding: number, includeHiddenNodes: boolean) => {}
	zoomIn(): void
	zoomOut(): void
	zoomTo(zoomLevel: number): void
	setTransform: () => {}
	toObject(): {
		elements: Elements
		position: [number, number]
		zoom: number
	}
	getElements(): Elements
}

// Interface available to the palette & canvas in order to share data
export interface IReactFlow {
	reactFlowInstance: reactFlowInstance | undefined
	setReactFlowInstance: React.Dispatch<
		React.SetStateAction<reactFlowInstance | undefined>
	>
	elements: Elements<any>
	setElements: React.Dispatch<React.SetStateAction<Elements<any>>>
}

export const FlowContext = createContext<IReactFlow>(null!)

export const FlowProvider: React.FC<{}> = ({ children }) => {
	const [rfInstance, setRFInstance] = useState<reactFlowInstance>()
	const [elements, setElements] = useState<Elements<any>>([])

	// https://blog.agney.dev/useMemo-inside-context/
	const inst = useMemo(
		() => ({
			reactFlowInstance: rfInstance,
			setReactFlowInstance: setRFInstance,
			elements,
			setElements,
		}),
		[rfInstance, elements]
	)

	return <FlowContext.Provider value={inst}>{children}</FlowContext.Provider>
}
