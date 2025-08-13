import React from 'react'
import { Content, ModalHeader } from './styles'

import CloseIcon from '../Icons/Close'
import { Paragraph } from '../Typography/text'
import Modal from './Modal'

const EditModal: React.FC<{
	title?: string
	children?: React.ReactNode
	close?: () => void
	isOpen: boolean
}> = ({ isOpen, title, close, children }) => {
	return (
		<Modal isOpen={isOpen} withDimmer hideCloseButton close={close}>
			<ModalHeader>
				<Paragraph style={{ marginLeft: 32, flex: 1 }}>
					{title}
				</Paragraph>
				<button className="btn-primary  " onClick={close}>
					<CloseIcon />
				</button>
			</ModalHeader>
			<Content>{children}</Content>
		</Modal>
	)
}

export default EditModal
