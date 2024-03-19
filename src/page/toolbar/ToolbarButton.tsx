import React from 'react'
import { Paragraph } from '@/components/Typography/text'
import { ToolbarButtonContainer, ToolbarLabel, ToolbarContent } from './styles'

export const ToolbarButton: React.FC<{ label: string }> = ({
	label,
	...props
}) => {
	return (
		<ToolbarButtonContainer>
			<ToolbarLabel>
				<Paragraph>{label}</Paragraph>
			</ToolbarLabel>
			<ToolbarContent>{props.children}</ToolbarContent>
		</ToolbarButtonContainer>
	)
}
