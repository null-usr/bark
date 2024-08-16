import styled from 'styled-components'
import { FlexRow } from '../styles'

export const ModalContainer = styled.div<{
	zIndex?: number
}>`
	z-index: ${({ zIndex }) => zIndex || 1001};

	display: flex;
	flex-direction: column;
	gap: 0px;

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: ${(props) => props.theme.secondaryBg};
	border: 1px solid white;
	border-radius: 2px;
`

export const ModalHeader = styled(FlexRow)`
	padding: 8px;
	background-color: white;
	min-height: 32px;
	align-items: center;
	justify-content: end;
	gap: 0px;
	text-align: center;
	/* flex-direction: row-reverse; */
`

export const Content = styled.div<{}>`
	// display: grid;
	// justify-content: center;
	// align-content: center;

	padding: 16px;
	color: white;
`

export const CloseButton = styled.div`
	position: absolute;
	top: 8px;
	right: 8px;
`
