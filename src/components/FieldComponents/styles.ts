import styled from 'styled-components'

export const FieldContainer = styled.div<{ error?: boolean }>`
	display: flex;
	gap: 8px;
	flex-direction: row;
	${({ error }) => (error ? 'border: 1px solid red;' : '')}
`
