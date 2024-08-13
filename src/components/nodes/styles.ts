import styled from 'styled-components'
import { FlexColumn } from '../styles'

export const NodeHeader = styled.div<{
	color?: string
}>`
	padding: 6px;
	min-height: 32px;
	background-color: ${({ color }) => color || 'white'};
`

export const Container = styled(FlexColumn)`
	display: flex;
	flex-direction: column;
`
export const ButtonRow = styled.div`
	display: flex;
	justify-content: center;
	gap: 8px;
`
