/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
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
				<button className="btn-alert" onClick={submit}>
					Delete
				</button>
				<button className="btn-secondary" onClick={cancel}>
					cancel
				</button>
			</FlexRow>
		</FlexColumn>
	)
}

export default DeleteScene
