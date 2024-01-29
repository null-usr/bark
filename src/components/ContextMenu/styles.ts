import styled from 'styled-components'

export const ContextMenuContainer = styled.div`
	width: 200px;
	background: white;
	border-style: solid;
	box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
	position: absolute;
	z-index: 10;
`

export const ContextButton = styled.div`
	border: none;
	display: block;
	padding: 0.5em;
	text-align: left;
	width: 100%;

	&:hover {
		background: white;
	}
`
