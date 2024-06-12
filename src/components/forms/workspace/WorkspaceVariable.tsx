import Button from '@/components/Button/Button'
import ExpandButton from '@/components/Button/ExpandButton'
import { Paragraph } from '@/components/Typography/text'
import { FlexColumn, FlexRow } from '@/components/styles'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'

const WorkspaceVariable: React.FC<{ name: string }> = ({ name }) => {
	const [expanded, setExpanded] = useState(false)
	const { workspace, dispatch } = useStore()
	const w_var = workspace.w_vars[name]
	return (
		<FlexColumn>
			<FlexRow style={{ justifyContent: 'space-between' }}>
				<FlexRow>
					<Paragraph color="white">{name}:</Paragraph>
					<Paragraph color="white">{w_var.type}</Paragraph>
				</FlexRow>
				<Button
					danger
					onClick={() =>
						dispatch({
							type: types.deleteWorkspaceVariable,
							data: name,
						})
					}
				>
					Delete
				</Button>
			</FlexRow>
			{expanded && (
				<>
					{w_var.options.map((o) => (
						<FlexRow
							style={{ justifyContent: 'space-between' }}
							key={o}
						>
							<Paragraph color="white">{o}</Paragraph>

							<Button
								type="secondary"
								danger
								onClick={() =>
									dispatch({
										type: types.editWorkspaceVariable,
										data: {
											name,
											// @ts-ignore
											options: w_var.options.filter(
												(op: string | number) =>
													op !== o
											),
										},
									})
								}
							>
								delete option
							</Button>
						</FlexRow>
					))}
					<Formik
						validateOnChange={false}
						validateOnBlur={false}
						validate={(values) => {
							const errors: any = {}

							if (
								w_var.type === 'string' &&
								(values as unknown as string).length < 1
							) {
								errors.option = 'Required'
							}

							// @ts-ignore
							if (w_var.options.includes(values.option)) {
								errors.option =
									'A variable with that name already exists'
							}

							return errors
						}}
						initialValues={{
							option: w_var.type === 'string' ? '' : 0,
						}}
						onSubmit={(values, { resetForm }) => {
							dispatch({
								type: types.editWorkspaceVariable,
								data: {
									name,
									options: [...w_var.options, values.option],
								},
							})

							resetForm()
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
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
								<label htmlFor="option">
									Option Name
									<Field
										required
										id="option"
										name="option"
										type={
											w_var.type === 'string'
												? 'text'
												: 'number'
										}
									/>
								</label>
								{errors.option ? (
									<div style={{ color: 'red' }}>
										{errors.option}
									</div>
								) : null}
								<button type="submit">Add Option</button>
							</Form>
						)}
					</Formik>
				</>
			)}

			<ExpandButton
				background="black"
				hover="gray"
				onClick={() => setExpanded(!expanded)}
			>
				{expanded && <>collapse</>}
				{!expanded && <>expand</>}
			</ExpandButton>
		</FlexColumn>
	)
}

export default WorkspaceVariable
