import React from 'react'
import Dimmer from './Dimmer'
import { Content, ModalContainer, ModalHeader } from './styles'

import IconButton from '../Button/IconButton'
import CloseIcon from '../Icons/Close'
import { Paragraph } from '../Typography/text'

const Modal: React.FC<{
	title?: string
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
	title,
	close,
	hideCloseButton,
	children,
}) => {
	return (
		<>
			{isOpen && withDimmer && <Dimmer onClick={close} />}

			{isOpen && (
				<ModalContainer>
					<ModalHeader>
						<Paragraph style={{ marginLeft: 32, flex: 1 }}>
							{title}
						</Paragraph>
						{!hideCloseButton && (
							<IconButton
								width={32}
								height={32}
								Icon={CloseIcon}
								onClick={close}
							/>
						)}
					</ModalHeader>
					<Content>{children}</Content>
				</ModalContainer>
			)}
		</>
	)
}

export default Modal
