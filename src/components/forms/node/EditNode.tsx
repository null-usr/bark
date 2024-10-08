/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'
import { H1, H3 } from '@/components/Typography/headers'
import ColorInput from '@/components/ColorInput'
import { Schema } from '@/helpers/types'
import { Paragraph } from '@/components/Typography/text'

// Edit a custom editor or workspace node
// Shared w/ Create Node
const EditNode: React.FC<{
	name?: string | null
	schema?: Schema | null
	color?: string
	saveToEditor?: boolean
	forbidden?: string[]
	submit: (name: string, color: string, saveToEditor: boolean) => void
	cancel: () => void
}> = ({ name, color, saveToEditor, forbidden, schema, submit, cancel }) => {
	return (
		<Formik
			validateOnChange={false}
			validateOnBlur={false}
			validate={(values) => {
				const errors: any = {}

				if (values.name.length < 1) {
					errors.name = 'Required'
				}

				let n = values.name
				if (!values.saveToEditor) {
					n = `@workspace/${n}`
				}

				if (forbidden?.includes(n) && (!schema || n !== schema.name)) {
					errors.name = 'A node with this name already exists'
				}

				return errors
			}}
			initialValues={{
				name: name || '',
				color: color || '#000000',
				saveToEditor:
					navigator.userAgent === 'electron'
						? saveToEditor || false
						: false,
			}}
			onSubmit={(values) => {
				submit(
					values.name,
					values.color,
					navigator.userAgent !== 'electron'
						? false
						: values.saveToEditor
				)
			}}
		>
			{({ values, errors, touched, handleSubmit, setFieldValue }) => (
				<Form onSubmit={handleSubmit}>
					<FlexColumn>
						<H3 color="white" style={{ alignSelf: 'center' }}>
							SAVE NODE
						</H3>
						<label htmlFor="name">Name</label>
						<Field name="name" />
						{errors.name ? (
							<Paragraph color="red">
								<i>*{errors.name}</i>
							</Paragraph>
						) : null}
						<label htmlFor="color">Color</label>
						{/* <Field name="color" type="color" className="nodrag" /> */}
						<ColorInput
							name="color"
							onChange={(c) => setFieldValue('color', c)}
						/>
						{navigator.userAgent === 'electron' && (
							<div>
								<label htmlFor="saveToEditor">
									Save to Editor
								</label>
								<Field name="saveToEditor" type="checkbox" />
							</div>
						)}
						<FlexRow>
							<Button submitType="submit">Save</Button>
							<Button type="subtle" onClick={cancel}>
								cancel
							</Button>
						</FlexRow>
					</FlexColumn>
				</Form>
			)}
		</Formik>
	)
}

export default EditNode
