/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'
import EditModal from '@/components/modal/EditModal'

// Create a custom editor or workspace node
const CreateWorkspace: React.FC<{
	name?: string | null
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	return (
		<EditModal title="Create Workspace" isOpen close={cancel}>
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
						<FlexColumn
							style={{ alignItems: 'center', padding: 8 }}
						>
							<label htmlFor="name">Name</label>
							<Field name="name" />
							{errors.name ? <div>{errors.name}</div> : null}
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
		</EditModal>
	)
}

export default CreateWorkspace
