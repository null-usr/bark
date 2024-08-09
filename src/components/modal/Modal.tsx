import React from 'react'
import Dimmer from './Dimmer'
import { CloseButton, Content, ModalContainer } from './styles'

import IconButton from '../Button/IconButton'
import CloseIcon from '../Icons/Close'

const Modal: React.FC<{
	withDimmer?: boolean
	children?: React.ReactNode
	close: () => void
	open: boolean
}> = ({ withDimmer, open, close, children }) => {
	return (
		<>
			{open && withDimmer && <Dimmer onClick={close} />}

			{open && (
				<ModalContainer>
					<CloseButton>
						<IconButton
							width={32}
							height={32}
							color="white"
							Icon={CloseIcon}
							onClick={close}
						/>
					</CloseButton>
					<Content>{children}</Content>
				</ModalContainer>
			)}
		</>
	)
}

export default Modal
