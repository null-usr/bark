/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import useStore from '@/store/store'
import { types } from '@/store/reducer'
import { FlexColumn, FlexRow } from '@/components/styles'
import Divider from '@/components/Divider'
import { Paragraph } from '@/components/Typography/text'
import styled from 'styled-components'
import { H2 } from '@/components/Typography/headers'
import EditModal from '@/components/modal/EditModal'
import WorkspaceVariable from './WorkspaceVariable'

const Container = styled(FlexColumn)`
	width: 50vw;
	height: 75vh;
	gap: 16px;
`

// Create a custom editor or workspace node
const EditWorkspace: React.FC<{
	name?: string | null
	submit: (name: string) => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	const { workspace, dispatch } = useStore()
	const workspaceVars = Object.keys(workspace.w_vars)

	const [newName, setNewName] = useState(name || '')
	const [isCreating, setIsCreating] = useState(false)

	return (
		<EditModal
			title={`Edit Workspace: ${name}`}
			isOpen
			close={() => submit(newName)}
		>
			<Container>
				<FlexRow style={{ gap: 16 }}>
					<Paragraph color="white">Workspace Name:</Paragraph>
					<input
						style={{ flex: 1 }}
						value={newName || ''}
						onChange={(e) => setNewName(e.target.value)}
					/>
				</FlexRow>
				<Divider />
				<H2 style={{ textAlign: 'center' }} color="white">
					Workspace Variables
				</H2>
				<div
					style={{
						padding: 8,
						flex: 1,
						overflowY: 'scroll',
						overflowX: 'hidden',
					}}
				>
					<FlexColumn>
						{workspaceVars.map((v) => {
							return <WorkspaceVariable key={v} name={v} />
						})}
					</FlexColumn>
				</div>
				{isCreating ? (
					<Formik
						validateOnChange={false}
						validateOnBlur={false}
						validate={(values) => {
							const errors: any = {}

							if (values.name.length < 1) {
								errors.name = 'Required'
							}

							if (workspaceVars.includes(values.name)) {
								errors.name =
									'A variable with that name already exists'
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
							setIsCreating(false)
						}}
					>
						{({
							values,
							errors,
							touched,
							handleSubmit,
							setFieldValue,
						}) => (
							<Form onSubmit={handleSubmit}>
								<FlexColumn style={{ alignItems: 'center' }}>
									<FlexRow>
										<label htmlFor="name">Name:</label>
										<Field name="name" />
									</FlexRow>
									{errors.name ? (
										<div>{errors.name}</div>
									) : null}
									<FlexRow
										style={{
											gap: 32,
											alignItems: 'center',
										}}
									>
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
									</FlexRow>
									<FlexRow>
										<button className="btn-primary" type="submit">
											Create
										</button>
										<button className="btn-alert"
											onClick={() => setIsCreating(false)}
										>
											Cancel
										</button>
									</FlexRow>
								</FlexColumn>
							</Form>
						)}
					</Formik>
				) : (
					<div style={{ alignSelf: 'center' }}>
						<button className="btn-secondary"
							onClick={() => setIsCreating(true)}
						>
							Create Workspace Variable
						</button>
					</div>
				)}
			</Container>
		</EditModal>
	)
}

export default EditWorkspace
