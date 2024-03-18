import React, { ReactNode } from 'react'
import styled from 'styled-components'

const Container = styled.div<{
	disabled?: boolean
	width?: number
	height?: number
	background?: string
	hover?: string
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
	display: inline-block;
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
	fill?: string
	stroke?: string
	background?: string
	hover?: string
	active?: string
	disabled?: boolean
	Icon: React.FunctionComponent<
		React.SVGProps<SVGSVGElement> & {
			title?: string | undefined
		}
	>
	onClick?: (e?: any) => void
}> = ({
	width = 32,
	height = 32,
	fill = 'black',
	stroke = 'black',
	background = 'transparent',
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
			background={background}
		>
			{/* @ts-ignore */}
			<Icon fill={fill} stroke={stroke} />
		</Container>
	)
}

export default IconButton
