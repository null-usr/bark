/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import Button from '@/components/Button/Button'
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
				<Button danger onClick={submit}>
					Delete
				</Button>
				<Button onClick={cancel}>cancel</Button>
			</FlexRow>
		</FlexColumn>
	)
}

export default DeleteNode
