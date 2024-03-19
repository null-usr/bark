import React from 'react'
import { ReactComponent as CloseIcon } from '@/assets/icons/close.svg'
import Dimmer from './Dimmer'
import { CloseButton, Content, ModalContainer } from './styles'

import IconButton from '../Button/IconButton'

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
							fill="white"
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
