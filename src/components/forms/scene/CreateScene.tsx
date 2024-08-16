/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'
import { Paragraph } from '@/components/Typography/text'

// Create a custom editor or workspace node
const CreateScene: React.FC<{
	name?: string | null
	forbidden?: string[]
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, forbidden, submit, cancel }) => {
	return (
		<Formik
			validateOnChange={false}
			validateOnBlur={false}
			validate={(values) => {
				const errors: any = {}

				if (values.name.length < 1) {
					errors.name = 'Required'
				}

				if (forbidden?.includes(values.name)) {
					errors.name = 'A node with this name already exists'
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
					<FlexColumn>
						<label htmlFor="name">Name</label>
						<Field name="name" />
						{errors.name ? (
							<Paragraph>
								<i>*{errors.name}</i>
							</Paragraph>
						) : null}

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

export default CreateScene
