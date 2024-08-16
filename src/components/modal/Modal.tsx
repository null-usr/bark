import React from 'react'
import Dimmer from './Dimmer'
import { Content, ModalContainer, ModalHeader } from './styles'

import IconButton from '../Button/IconButton'
import CloseIcon from '../Icons/Close'
import { Paragraph } from '../Typography/text'

const Modal: React.FC<{
	title?: string
	withDimmer?: boolean
	children?: React.ReactNode
	close: () => void
	open: boolean
}> = ({ withDimmer, open, title, close, children }) => {
	return (
		<>
			{open && withDimmer && <Dimmer onClick={close} />}

			{open && (
				<ModalContainer>
					<ModalHeader>
						<Paragraph style={{ marginLeft: 32, flex: 1 }}>
							{title}
						</Paragraph>

						<IconButton
							width={32}
							height={32}
							Icon={CloseIcon}
							onClick={close}
						/>
					</ModalHeader>
					<Content>{children}</Content>
				</ModalContainer>
			)}
		</>
	)
}

export default Modal
