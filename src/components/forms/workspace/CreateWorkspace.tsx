/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/Button/Button'

// Create a custom editor or workspace node
const CreateWorkspace: React.FC<{
	name?: string | null
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	return (
		<Formik
			validateOnChange={false}
			validateOnBlur={false}
			validate={(values) => {
				const errors: any = {}

				if (values.name.length < 1) {
					errors.name = 'Required'
				}

				return errors
			}}
			initialValues={{
				name: name || '',
			}}
			onSubmit={(values) => {
				submit(values.name)
			}}
		>
			{({ values, errors, touched, handleSubmit, setFieldValue }) => (
				<Form onSubmit={handleSubmit}>
					<label htmlFor="name">Name</label>
					<Field name="name" />
					{errors.name ? <div>{errors.name}</div> : null}
					<Button submitType="submit">Save</Button>
					<Button type="subtle" onClick={cancel}>
						cancel
					</Button>
				</Form>
			)}
		</Formik>
	)
}

export default CreateWorkspace
