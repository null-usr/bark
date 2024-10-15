import React from 'react'
import Dimmer from './Dimmer'
import { CloseButton, ModalContainer } from './styles'

import IconButton from '../Button/IconButton'
import CloseIcon from '../Icons/Close'

const Modal: React.FC<{
	top?: string
	bottom?: string
	right?: string
	left?: string
	hideCloseButton?: boolean
	withDimmer?: boolean
	children?: React.ReactNode
	close?: () => void
	isOpen: boolean
}> = ({
	withDimmer,
	top,
	bottom,
	right,
	left,
	isOpen,
	close,
	hideCloseButton,
	children,
}) => {
	return (
		<>
			{isOpen && withDimmer && <Dimmer onClick={close} />}

			{isOpen && (
				<ModalContainer
					top={top}
					bottom={bottom}
					left={left}
					right={right}
				>
					{!hideCloseButton && (
						<CloseButton>
							<IconButton
								width={32}
								height={32}
								Icon={CloseIcon}
								onClick={close}
							/>
						</CloseButton>
					)}
					{children}
				</ModalContainer>
			)}
		</>
	)
}

export default Modal
