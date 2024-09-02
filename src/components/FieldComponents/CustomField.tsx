// Field using dropdown of workspace vars

import useStore from '@/store/store'
import Button from '@/components/Button/Button'
import React, { useEffect, useState } from 'react'
import { FieldContainer } from './styles'

export const CustomField: React.FC<{
	k: string
	v: { workspaceVar: string; value: string }
	index: number
	updateKey(index: number, k: string): void
	updateValue(index: number, v: any): void
	del?(k: string): void
	error?: boolean
}> = ({ k, v, index, error, updateKey, updateValue, del }) => {
	const { workspace } = useStore()
	const { w_vars } = workspace
	const [key, setKey] = useState(k)
	const [value, setValue] = useState(v.value)

	const [customVar, setCustomVar] = useState<string | null>(v.workspaceVar)

	// Forward changing values from the node details
	useEffect(() => {
		setValue(v.value)
	}, [v])
	return (
		<FieldContainer error={error}>
			<input
				type="text"
				value={key}
				onChange={(e) => setKey(e.target.value)}
				// onSubmit={() => updateKey(index, key)}
			/>
			:
			<select
				name="workspaceVar"
				value={v.workspaceVar ? v.workspaceVar : undefined}
				onChange={(e) => {
					updateValue(index, {
						workspaceVar: e.target.value,
						value: '',
					})
					setCustomVar(e.target.value)
				}}
			>
				<option value="" selected disabled hidden>
					Choose workspace variable
				</option>
				{Object.keys(w_vars).map((w_var) => {
					return (
						<option key={w_var} value={w_var}>
							{w_var}
						</option>
					)
				})}
			</select>
			{customVar && w_vars[customVar] && (
				<select
					name="option"
					value={v.value ? v.value : undefined}
					onChange={(e) => {
						setValue(e.target.value)
						updateValue(index, {
							workspaceVar: v.workspaceVar,
							value: e.target.value,
						})
					}}
				>
					<option value="" selected disabled hidden>
						Choose option
					</option>
					{w_vars[customVar].options.map((o) => {
						return (
							<option key={o} value={o}>
								{o}
							</option>
						)
					})}
				</select>
			)}
			{k !== key && (
				<Button onClick={() => updateKey(index, key)}>
					Update Key
				</Button>
			)}
			<Button danger onClick={del ? () => del(k) : undefined}>
				Delete
			</Button>
		</FieldContainer>
	)
}
