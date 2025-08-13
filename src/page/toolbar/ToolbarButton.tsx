import React from 'react'
import { Paragraph } from '@/components/Typography/text'
import { ToolbarButtonContainer, ToolbarLabel, ToolbarContent } from './styles'

export const ToolbarButton: React.FC<{ label: string, children: React.ReactNode }> = ({
	label,
	children
}) => {
	return (
		<ToolbarButtonContainer>
			<ToolbarLabel>
				<Paragraph>{label}</Paragraph>
			</ToolbarLabel>
			<ToolbarContent>{children}</ToolbarContent>
		</ToolbarButtonContainer>
	)
}
