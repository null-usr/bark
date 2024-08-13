import React from 'react'
import { BooleanField } from '@/components/FieldComponents/BooleanField'
import { NumberField } from '@/components/FieldComponents/NumberField'
import { StringField } from '@/components/FieldComponents/StringField'
import { TextField } from '@/components/FieldComponents/TextField'
import { Field } from '@/helpers/types'
import { ObjectField } from '@/components/FieldComponents/ObjectField'

export const renderField = (
	field: Field,
	index: number,
	color: string,
	error: boolean,
	id: string,
	updateKey: (index: number, v: any) => void,
	deleteField: (k: string) => void,
	updateValue?: (index: number, v: any) => void,
	updateDataFieldKey?: (index: number, k: string) => void,
	addHandle?: (name: string) => void
) => {
	switch (field.type) {
		case 'string':
			return (
				<StringField
					index={index}
					key={field.key}
					k={field.key}
					v={field.value}
					updateValue={updateValue!}
					updateKey={updateKey}
					del={deleteField}
					// error={error || false}
				/>
			)
		case 'text':
			return (
				<TextField
					index={index}
					key={field.key}
					k={field.key}
					v={field.value}
					updateValue={updateValue!}
					updateKey={updateKey}
					del={deleteField}
					// error={error || false}
				/>
			)
		case 'bool':
			return (
				<BooleanField
					index={index}
					key={field.key}
					k={field.key}
					v={field.value}
					updateValue={updateValue!}
					updateKey={updateKey}
					del={deleteField}
					// error={error || false}
				/>
			)
		case 'number':
			return (
				<NumberField
					index={index}
					key={field.key}
					k={field.key}
					v={field.value}
					updateValue={updateValue!}
					updateKey={updateKey}
					del={deleteField}
					// error={error || false}
				/>
			)
		case 'data':
			return (
				<ObjectField
					color={color}
					add={addHandle!}
					id={id}
					key={field.key}
					k={field.key}
					v={field.value}
					index={index}
					update={updateDataFieldKey!}
					del={deleteField}
					error={error || false}
				/>
			)
		default:
			return <></>
	}
}
