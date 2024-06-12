/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'
import Divider from '@/components/Divider'
import { Paragraph } from '@/components/Typography/text'
import styled from 'styled-components'
import WorkspaceVariable from './WorkspaceVariable'

const Container = styled(FlexColumn)`
	width: 75vw;
`

// Create a custom editor or workspace node
const EditWorkspace: React.FC<{
	name?: string | null
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	const { workspace, dispatch } = useStore()
	const workspaceVars = Object.keys(workspace.w_vars)
	return (
		<Container>
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
						<FlexColumn>
							<label htmlFor="name">Workspace Name</label>
							<Field name="name" />
							{errors.name ? <div>{errors.name}</div> : null}

							<FlexRow style={{ justifyContent: 'center' }}>
								<Button submitType="submit">Save</Button>
								<Button type="subtle" onClick={cancel}>
									cancel
								</Button>
							</FlexRow>
						</FlexColumn>
					</Form>
				)}
			</Formik>
			<Divider color="white" />
			<Paragraph color="white">Workspace Variables</Paragraph>
			{workspaceVars.map((v) => {
				return <WorkspaceVariable key={v} name={v} />
			})}
			<Formik
				validateOnChange={false}
				validateOnBlur={false}
				validate={(values) => {
					const errors: any = {}

					if (values.name.length < 1) {
						errors.name = 'Required'
					}

					if (workspaceVars.includes(values.name)) {
						errors.name = 'A variable with that name already exists'
					}

					return errors
				}}
				initialValues={{
					name: '',
					type: 'string',
				}}
				onSubmit={(values, { resetForm }) => {
					dispatch({
						type: types.createWorkspaceVariable,
						data: {
							name: values.name,
							type: values.type,
						},
					})

					resetForm()
				}}
			>
				{({ values, errors, touched, handleSubmit, setFieldValue }) => (
					<Form onSubmit={handleSubmit}>
						<FlexColumn>
							<label htmlFor="name">Variable Name</label>
							<Field name="name" />
							{errors.name ? <div>{errors.name}</div> : null}
							<p>TYPE</p>
							<label>
								String
								<Field
									name="type"
									type="radio"
									value="string"
								/>
							</label>
							<label>
								Number
								<Field
									name="type"
									type="radio"
									value="number"
								/>
							</label>
							<button type="submit">
								Create Workspace Variable
							</button>
						</FlexColumn>
					</Form>
				)}
			</Formik>
		</Container>
	)
}

export default EditWorkspace
