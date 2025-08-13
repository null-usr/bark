import React from 'react'
import styled from 'styled-components'
import { FlexColumn, FlexRow } from './styles'
import { Caption1, Paragraph } from './Typography/text'
import CloseIcon from './Icons/Close'

const Container = styled(FlexRow)`
	padding: 16px;
	border: 1px solid black;
	background-color: white;
	align-items: center;
	justify-content: space-between;
	min-width: 100px;
`

const Notification: React.FC<{
	title?: string
	Icon?: React.ReactNode
	notification: string
	onClose: () => void
}> = ({ title, Icon, notification, onClose }) => {
	return (
		<Container>
			{Icon}
			<FlexColumn>
				{title && <Paragraph>{title}</Paragraph>}
				<Caption1>{notification}</Caption1>
			</FlexColumn>
			<button className="btn-primary  " onClick={onClose}>
				<CloseIcon />
			</button>
		</Container>
	)
}

export default Notification
