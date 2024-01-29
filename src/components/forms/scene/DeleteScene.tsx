/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { Formik, Form, Field } from 'formik'
import Button from '@/components/Button/Button'
import { FlexColumn, FlexRow } from '@/components/styles'

// Create a custom editor or workspace node
const DeleteScene: React.FC<{
	name?: string | null
	submit: () => void
	cancel: () => void
}> = ({ name, submit, cancel }) => {
	return (
		<FlexColumn>
			<p>Are you sure you want to delete {name}?</p>
			<FlexRow>
				<Button danger onClick={submit}>
					Delete
				</Button>
				<Button type="subtle" onClick={cancel}>
					cancel
				</Button>
			</FlexRow>
		</FlexColumn>
	)
}

export default DeleteScene
