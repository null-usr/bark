/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import { Paragraph } from '@/components/Typography/text'
import { FlexColumn, FlexRow } from '@/components/styles'

// Create a custom editor or workspace node
const DeleteNode: React.FC<{
	name?: string | null
	submit: () => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	return (
		<FlexColumn>
			<Paragraph color="white">
				Are you sure you want to delete {name}?
			</Paragraph>
			<FlexRow style={{ justifyContent: 'center' }}>
				<button className="btn-danger" onClick={submit}>
					Delete
				</button>
				<button className="btn-primary" onClick={cancel}>cancel</button>
			</FlexRow>
		</FlexColumn>
	)
}

export default DeleteNode
