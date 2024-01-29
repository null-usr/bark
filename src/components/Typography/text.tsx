import styled from 'styled-components'

import { ParagraphProps, TextProps } from './types'

export const Paragraph = styled.div<ParagraphProps>`
	color: ${({ color }) => color || 'black'};
	font-size: ${({ size }) => size || 18}px;
	font-weight: ${({ weight }) => weight || 400};
	${({ letterSpacing }) =>
		letterSpacing ? `letter-spacing: ${letterSpacing}em;` : ''}
	margin: 0;

	white-space: normal;
`

// InnerText should inherit everything unless otherwise stated
export const InnerText = styled.span<ParagraphProps>`
	${({ color }) => color && `color: ${color};`}
	${({ size }) => size && `font-size: ${size}px;`}
  font-weight: ${({ weight }) => weight || 'inherit'};
	${({ letterSpacing }) =>
		letterSpacing ? `letter-spacing: ${letterSpacing}em;` : ''}
	line-height: initial;
	margin: 0;
`
export const Text = styled.p<TextProps>`
	color: ${({ color }) => color || 'black'};
	${({ inline }) => inline && `display: ${inline};`}
	font-size: ${({ size }) => size || 16}px;
	font-weight: ${({ weight }) => weight || 400};
	${({ letterSpacing }) =>
		letterSpacing ? `letter-spacing: ${letterSpacing}em;` : ''}
	margin: 0;
	line-height: initial;
`

export const Link = styled.a<ParagraphProps>`
	color: ${({ color }) => color || 'blue'};
	font-weight: ${({ weight }) => weight || 300};
	font-size: ${({ size }) => size || 18}px;
`
