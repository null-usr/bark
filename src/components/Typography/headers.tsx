import styled from 'styled-components'

import { TypographyProps } from './types'

const Header = styled.h1<TypographyProps>`
	color: ${({ color }) => color || 'black'};
	font-weight: ${({ weight }) => weight || 400};
	${({ letterSpacing }) =>
		letterSpacing ? `letter-spacing: ${letterSpacing}em;` : ''}
	font-size: 36px;
`

export const H1 = styled(Header)`
	font-size: 36px;
`
export const H2 = styled(Header)`
	font-size: 24px;
`
export const H3 = styled(Header)`
	font-size: 20px;
`
export const H4 = styled(Header)`
	font-size: 18px;
`
