import React from 'react'
import styled from 'styled-components'
import { FlexColumn, FlexRow } from './styles'
import { Caption1, Paragraph } from './Typography/text'
import CloseIcon from './Icons/Close'
import IconButton from './Button/IconButton'

const Container = styled(FlexRow)`
	border: 1px solid black;
	align-items: center;
	justify-content: space-between;
	min-width: 400px;
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
			<IconButton
				width={32}
				height={32}
				Icon={CloseIcon}
				onClick={onClose}
			/>
		</Container>
	)
}

export default Notification
