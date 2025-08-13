import styled from 'styled-components'

export const FieldContainer = styled.div<{ error?: boolean }>`
	position: relative;
	display: flex;
	gap: 8px;
	flex-direction: row;
	align-items: center;
	${({ error }) => (error ? 'border: 1px solid red;' : '')}
`
