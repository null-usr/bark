import styled from 'styled-components'

export const NodeHeader = styled.div<{
	color?: string
}>`
	min-height: 32px;
	background-color: ${({ color }) => color || 'white'};
`
