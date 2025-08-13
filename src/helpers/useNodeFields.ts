import { useState, useEffect } from 'react'
import { Edge, useUpdateNodeInternals } from 'reactflow'
import { getOutgoingEdges } from '@/helpers/edgeHelpers'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import { Field } from '@/helpers/types'

export function useNodeFields(
	id: string,
	data: { fields: Field[]; color: string }
) {
	const { edges, dispatch } = useStore()
	const updateNodeInternals = useUpdateNodeInternals()

	const [fields, setFields] = useState<Field[]>(data.fields || [])
	const [sourceArray, setSourceArray] = useState<any[]>(
		data.fields.filter((f) => f.type === 'data').map((f) => f.value) || []
	)
	const [errors, setErrors] = useState<{ [key: number]: boolean }>({})
	const [count, setCount] = useState(fields.length)

	const addHandle = (key: string) => setSourceArray((prev) => [...prev, key])

	const addField = (type: string) => {
		let fieldKey = `key:${count}`

		let suffix = count

		while (data.fields.some((f) => f.key === fieldKey)) {
			suffix++
			fieldKey = `key:${suffix}`
		}

		console.log(data.fields)

		let value: any = ''

		if (type === 'string' || type === 'text') value = `value ${count}`
		else if (type === 'number') value = 0
		else if (type === 'data') {
			value = undefined
			addHandle(fieldKey)
		} else if (type === 'custom') value = { workspaceVar: '', value: '' }
		else value = false

		const newField = { key: fieldKey, value, type }
		setFields((f) => [...f, newField])
		data.fields = [...data.fields, newField]
		setCount((c) => c + 1)
	}

	const updateKey = (index: number, k: string) => {
		if (data.fields.some((f, i) => f.key === k && i !== index)) {
			setErrors({ [index]: true })
			return
		}
		setErrors({})
		setFields((f) => {
			const copy = [...f]
			copy[index] = { ...copy[index], key: k }
			return copy
		})
		data.fields[index] = { ...data.fields[index], key: k }
	}

	const updateDataFieldKey = (index: number, k: string) => {
		if (data.fields.some((f, i) => f.key === k && i !== index)) {
			setErrors({ [index]: true })
			return
		}
		const outgoing = getOutgoingEdges(id, edges)
		const editEdge = outgoing.find(
			(e) => e.sourceHandle === fields[index].key
		)
		if (editEdge) {
			dispatch({
				type: types.editEdgeHandle,
				data: {
					old: editEdge,
					new: {
						source: editEdge.source,
						target: editEdge.target,
						sourceHandle: k,
						targetHandle: editEdge.targetHandle,
					},
				},
			})
		}
		setErrors({})
		setFields((f) => {
			const copy = [...f]
			copy[index] = { ...copy[index], key: k }
			return copy
		})
		setSourceArray((arr) => [
			...arr.filter((h) => h !== fields[index].key),
			k,
		])
		data.fields[index] = { ...data.fields[index], key: k }
	}

	const updateValue = (index: number, v: any) => {
		setFields((f) => {
			const copy = [...f]
			copy[index] = { ...copy[index], value: v }
			return copy
		})
		data.fields[index] = { ...data.fields[index], value: v }
	}

	const deleteField = (key: string) => {
		const tmpField = fields.find((f) => f.key === key)
		if (tmpField && tmpField.type === 'data') {
			const edge: Edge<any> = edges.filter((e) => {
				return e.source === id && e.sourceHandle === key
			})[0]

			dispatch({ type: types.deleteEdge, data: edge.id })
		}
		setFields((f) => f.filter((field) => field.key !== key))
		data.fields = data.fields.filter((field) => field.key !== key)
	}

	useEffect(() => {
		updateNodeInternals(id)
	}, [sourceArray, data.fields])

	useEffect(() => {
		setFields([...data.fields])
	}, [data.fields])

	return {
		fields,
		sourceArray,
		errors,
		addField,
		addHandle,
		updateKey,
		updateDataFieldKey,
		updateValue,
		deleteField,
	}
}
