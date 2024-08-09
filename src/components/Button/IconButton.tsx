import React, { ReactNode } from 'react'
import styled from 'styled-components'

const Container = styled.div<{
	disabled?: boolean
	width?: number
	height?: number
	background?: string
	hover?: string
	radius: string
}>`
	${({ disabled }) =>
		disabled
			? 'cursor: not-allowed; pointer-events: none;'
			: 'cursor: pointer;'};

	& svg {
		${({ disabled }) => (disabled ? `fill: ${disabled};` : '')}
	}

	& :hover {
		& svg {
			fill: ${({ hover }) => hover && `fill: ${hover}; stroke:${hover};`};
		}
	}

	align-self: center;
	display: grid;
	align-items: center;
	justify-items: center;
	border-radius: ${({ radius }) => radius};
	height: ${({ height }) => height}px;
	width: ${({ width }) => width}px;
	background: ${({ background }) => background || 'transparent'};
`

const IconButtonWrapper = styled.div<{
	disabled?: boolean
	onClick?: (e: React.MouseEventHandler<HTMLDivElement>) => void
}>`
	${({ disabled }) => (disabled ? 'pointer-events: none;' : '')}

	& svg {
		${({ disabled }) => (disabled ? `fill: ${disabled};` : '')}
	}
`

const IconButton: React.FC<{
	width?: number
	height?: number
	color?: string
	background?: string
	hover?: string
	active?: string
	disabled?: boolean
	radius?: string
	Icon: React.FunctionComponent<{
		color?: string
		hover?: string
		active?: string
	}>
	onClick?: (e?: any) => void
}> = ({
	width = 32,
	height = 32,
	color = 'black',
	background = 'transparent',
	radius = '0px',
	hover,
	active,
	disabled,
	Icon,
	onClick,
}) => {
	return (
		<Container
			onClick={onClick}
			hover={hover}
			disabled={disabled}
			width={width}
			height={height}
			radius={radius}
			background={background}
		>
			{/* @ts-ignore */}
			<Icon color={color} />
		</Container>
	)
}

export default IconButton
