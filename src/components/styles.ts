import styled from 'styled-components'

export const FlexRow = styled.div`
	display: flex;
	gap: 8px;
	flex-direction: row;
`

export const FlexColumn = styled(FlexRow)`
	flex-direction: column;
`

export const Grid = styled.div`
	display: grid;
`
