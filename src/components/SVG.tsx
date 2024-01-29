import styled from 'styled-components'
import React from 'react'

const StyledIcon = styled.svg.attrs({
	version: '1.1',
	xmlns: 'http://www.w3.org/2000/svg',
	xmlnsXlink: 'http://www.w3.org/1999/xlink',
})``

export const Svg = styled(StyledIcon)<{ color?: string; styleString?: string }>`
	${({ styleString }) => styleString || ''}
`

export const DefaultSVGCSS = (color: any, active: any, hover: any) => {
	return `
  display: block;
  ${color ? `color: ${color};` : `color:gray;`}

  &:hover {
    ${hover ? `color: ${hover};` : ''};
  }

  &:active {
    ${active ? `color: ${active};` : ''};
  }`
}

const IconContainer = styled.div<{
	width: number
	height: number
	backgroundColor?: string
	shape: 'circle' | 'square' | 'rounded'
}>`
	vertical-align: middle;
	display: inline-block;
	width: ${({ width }) => width}px;
	height: ${({ height }) => height}px;

	border-radius: ${({ shape }) => {
		if (shape === 'circle') {
			return '50%'
		}
		if (shape === 'square') {
			return '0px'
		}
		if (shape === 'rounded') {
			return '6px'
		}

		return '0px'
	}};

	background-color: ${({ backgroundColor }) =>
		backgroundColor || 'transparent'};
`

export interface IconProps {
	width?: number
	height?: number
	color?: string
	hover?: string
	active?: string
}

export interface Props {
	width?: number
	height?: number
	color?: string
	hover?: string
	active?: string
	Component: React.FC<{ styleString?: string }>
	backgroundColor?: string
	shape?: 'circle' | 'square' | 'rounded'
	style?: string
}

export const Icon: React.FC<Props> = ({
	width = 24,
	height = 24,
	//   color = colors.gray[60],
	color = 'gray',
	hover,
	active,
	Component,
	style,
	shape = 'square',
	backgroundColor,
}) => {
	return (
		<IconContainer
			shape={shape}
			height={height}
			width={width}
			backgroundColor={backgroundColor}
		>
			<Component
				styleString={style || DefaultSVGCSS(color, active, hover)}
			/>
		</IconContainer>
	)
}
