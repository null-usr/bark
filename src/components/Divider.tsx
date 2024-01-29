import colors from '@/helpers/theme/colors'
import styled from 'styled-components'

export interface Props {
	height?: number
	width?: number
	color?: string
	radius?: number
	top?: number
	bottom?: number
}

const Divider = styled.div<Props>`
	width: 100%;
	height: ${({ height }) => height || 1}px;
	${({ radius }) => (radius ? `border-radius: ${radius}px;` : '')}
	background-color: ${({ color }) => color || colors.gray[40]};
	padding: 0px;
	margin-bottom: ${({ bottom }) => bottom || 8}px;
	${({ top }) => (top ? `margin-top: ${top}px;` : '')}
`

export const VerticalDivider = styled.div<Props>`
	height: 100%;
	width: ${({ width }) => width || 1}px;
	${({ radius }) => (radius ? `border-radius: ${radius}px;` : '')}
	background-color: ${({ color }) => color || colors.gray[40]};
	padding: 0px;
	${({ top }) => (top ? `padding-top: ${top}px;` : '')}
	${({ bottom }) => (bottom ? `padding-bottom: ${bottom}px;` : '')}
`

export default Divider
