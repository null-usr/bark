import styled from 'styled-components'
import { Paragraph } from '../Typography/text'

export const ContextMenuContainer = styled.div`
	width: 200px;
	background: ${(props) => props.theme.secondaryBg};
	border: 1px solid white;
	box-shadow: 10px 19px 20px rgba(0, 0, 0, 10%);
	padding: 8px;
	position: absolute;
	z-index: 10;
`

export const ContextButton = styled.div`
	border: none;
	display: block;
	padding: 0.5em;
	text-align: left;
	/* width: 100%; */

	${Paragraph} {
		color: white;
	}

	/* &:hover {
		background: white;
	} */
`
