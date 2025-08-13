/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
import Divider from '@/components/Divider'
import ChevronDownIcon from '@/components/Icons/ChevronDown'
import ChevronUpIcon from '@/components/Icons/ChevronUp'
import { H2, H3 } from '@/components/Typography/headers'
import { Paragraph } from '@/components/Typography/text'
import { FlexColumn, FlexRow } from '@/components/styles'
import { types } from '@/store/reducer'
import useStore from '@/store/store'
import { Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import styled from 'styled-components'

const Container = styled(FlexColumn)`
	box-sizing: border-box;
	border: 1px solid white;
	padding: 8px;
`

const WorkspaceVariable: React.FC<{ name: string }> = ({ name }) => {
	const [expanded, setExpanded] = useState(false)
	const [deleting, setDeleting] = useState(false)
	const { workspace, dispatch } = useStore()
	const w_var = workspace.w_vars[name]
	return (
		<Container>
			{deleting ? (
				<>
					<H3
						color="white"
						style={{ textAlign: 'center', margin: 0 }}
					>
						Are you sure you want to delete {name}?
					</H3>
					<FlexRow style={{ justifyContent: 'center', gap: 32 }}>
						<button
							className="btn-alert"
							onClick={() =>
								dispatch({
									type: types.deleteWorkspaceVariable,
									data: name,
								})
							}
						>
							Yes
						</button>
						<button
							className="btn-secondary"
							onClick={() => setDeleting(false)}
						>
							No
						</button>
					</FlexRow>
				</>
			) : (
				<>
					<FlexRow style={{ justifyContent: 'space-between' }}>
						<FlexRow style={{ gap: 8 }}>
							<Paragraph color="white">
								{name} ({w_var.type}):
							</Paragraph>
							<Paragraph color="white">
								{w_var.options.length} options
							</Paragraph>
						</FlexRow>
						<FlexRow style={{ gap: 16 }}>
							<button
								color="white"
								className="btn-primary"
								onClick={() => setExpanded(!expanded)}
							>
								{expanded ? (
									<>{ChevronUpIcon}</>
								) : (
									<>{ChevronDownIcon}</>
								)}
							</button>
							<button
								className="btn-alert"
								onClick={() => setDeleting(true)}
							>
								Delete
							</button>
						</FlexRow>
					</FlexRow>
					{expanded && (
						<>
							{w_var.options.map((o) => (
								<FlexRow
									style={{ justifyContent: 'space-between' }}
									key={o}
								>
									<Paragraph color="white">{o}</Paragraph>

									<button
										className="btn-alert"
										onClick={() =>
											dispatch({
												type: types.editWorkspaceVariable,
												data: {
													name,
													options:
														// @ts-ignore
														w_var.options.filter(
															(
																op:
																	| string
																	| number
															) => op !== o
														),
												},
											})
										}
									>
										delete option
									</button>
								</FlexRow>
							))}
							<Divider style={{ marginTop: 8 }} />
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
											options: [
												...w_var.options,
												values.option,
											],
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
										<FlexRow
											style={{
												gap: 16,
												alignItems: 'center',
											}}
										>
											<label htmlFor="option">
												Option Name:
											</label>
											<Field
												style={{ flex: 1 }}
												required
												id="option"
												name="option"
												type={
													w_var.type === 'string'
														? 'text'
														: 'number'
												}
											/>
											{errors.option ? (
												<div style={{ color: 'red' }}>
													{errors.option}
												</div>
											) : null}
											<button
												className="btn-secondary"
												type="submit"
											>
												Add Option
											</button>
										</FlexRow>
									</Form>
								)}
							</Formik>
						</>
					)}
				</>
			)}
		</Container>
	)
}

export default WorkspaceVariable
