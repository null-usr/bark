import React from 'react'
import { DropdownContainer, DropdownButton, DropdownContent } from './styles'

export const Dropdown: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => {
	return (
		<DropdownContainer>
			<DropdownButton>{label}</DropdownButton>
			<DropdownContent>{children}</DropdownContent>
		</DropdownContainer>
	)
}
