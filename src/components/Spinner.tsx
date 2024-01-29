import colors from '@/helpers/theme/colors'
import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div<{
	color?: string
	thickness?: number
	width?: number
	testid?: string
}>`
	border: ${({ thickness }) => thickness || 8}px solid ${colors.gray[20]};
	border-radius: 50%;
	border-top: ${({ thickness }) => thickness || 8}px solid
		${({ color }) => color || colors.primary};
	width: ${({ width }) => width || 48}px;
	height: ${({ width }) => width || 48}px;
	animation: ${spin} 2s linear infinite;
`

export default Spinner
