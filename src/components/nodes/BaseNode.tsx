import React, { ReactNode, useEffect, useState } from 'react'
import {
	Handle,
	Position,
	NodeProps,
	useUpdateNodeInternals,
	NodeToolbar,
} from 'reactflow'
import { Node } from '@/helpers/theme'
import { FlexRow, FlexColumn } from '@/components/styles'
import ColorInput from '@/components/ColorInput'
import ChevronDown from '@/components/Icons/ChevronDown'
import ControlledAccordion from '@/components/Accordion/ControlledAccordion'
import { useNodeFields } from '@/helpers/useNodeFields'
import { renderField } from './renderField'
import { Field } from '@/helpers/types'
import { ButtonRow, NodeHeader } from './styles'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import NotepadIcon from '../Icons/Notepad'
import SaveIcon from '../Icons/Save'
import CloseIcon from '../Icons/Close'

type BaseNodeProps = NodeProps<any> & {
	header?: ReactNode
	body?: ReactNode
	name: string
	color: string
}

export default function BaseNode({
	id,
	data,
	selected,
	header,
	body,
}: BaseNodeProps) {
	const [expanded, setExpanded] = useState(true)
	const [name, setName] = useState<string>(data.name)

	// const updateNodeInternals = useUpdateNodeInternals()

	// useEffect(() => {
	// 	updateNodeInternals(id)
	// }, [expanded])

	const {
		nodes,
		mode,
		dispatch,
		updateNodeColor,
		// updateNodeName,
		deleteNode,
	} = useStore()

	const {
		fields,
		sourceArray,
		errors,
		addField,
		updateKey,
		updateValue,
		updateDataFieldKey,
		deleteField,
		addHandle,
	} = useNodeFields(id, data)

	return (
		<>
			<NodeToolbar isVisible={true}>
				<FlexRow style={{ alignItems: 'center' }}>
					<ButtonRow>
						<button
							className="btn-primary"
							onClick={() =>
								dispatch({
									type: types.setNode,
									data: id,
								})
							}
						>
							<NotepadIcon />
						</button>
						{/* we can only save in non-customize mode */}
						{mode !== 'customize' && (
							<button
								className="btn-primary"
								onClick={() =>
									dispatch({
										type: types.setSaveNodes,
										data: nodes.filter((n) => n.id === id),
									})
								}
							>
								<SaveIcon />
							</button>
						)}
						<button
							className="btn-primary"
							onClick={() => deleteNode(id)}
						>
							<CloseIcon />
						</button>
					</ButtonRow>
				</FlexRow>
			</NodeToolbar>
			<Node
				className="bg-dark"
				color={data.color}
				selected={selected}
			>
				<Handle
					type="target"
					position={Position.Left}
					style={{
						background: data.color,
						borderColor: 'black',
						top: 25,
					}}
				/>
				<NodeHeader color={data.color}>
					<FlexRow style={{ justifyContent: 'space-between' }}>
						<FlexRow style={{ alignItems: 'center' }}>
							<input
								type="text"
								className="nodrag"
								value={name}
								onChange={(e) => {
									// updateNodeName(id, e.target.value)
									setName(e.target.value)
									data.name = e.target.value
								}}
							/>
							<ColorInput
								width="32px"
								height="32px"
								value={data.color}
								onChange={(color) => updateNodeColor(id, color)}
							/>
						</FlexRow>
					</FlexRow>
				</NodeHeader>
				<div
					style={{ textAlign: 'center', cursor: 'pointer' }}
					onClick={() => setExpanded((e) => !e)}
				>
					<ChevronDown
						className={`transition-transform duration-300 ${
							expanded ? 'rotate-180' : ''
						}`}
					/>
				</div>

				<ControlledAccordion isOpen={expanded}>
					<FlexColumn style={{ padding: 8, gap: 4 }}>
						<FlexColumn
							style={{
								gap: 4,
							}}
							className="nodrag"
						>
							{header}
							{fields.map((field: Field, index: number) => {
								return renderField(
									field,
									index,
									data.color,
									errors[index] || false,
									id,
									updateKey,
									deleteField,
									updateValue,
									updateDataFieldKey,
									addHandle
								)
							})}
							{body}
						</FlexColumn>
					</FlexColumn>
				</ControlledAccordion>
				<Handle
					type="source"
					position={Position.Right}
					id={id}
					style={{
						background: data.color,
						borderColor: 'black',
						top: 25,
					}}
				/>
				{/* {!expanded && (
				<>
					{sourceArray.map((h: any) => (
						<Handle
							type="source"
							key={h}
							id={h}
							position={Position.Right}
							onClick={undefined}
							style={{
								top: 70,
								pointerEvents: 'none',
								borderColor: 'black',
								background: data.color,
							}}
							isConnectable={false}
						/>
					))}
				</>
			)} */}
			</Node>
		</>
	)
}
