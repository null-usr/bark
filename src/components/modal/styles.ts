import styled from 'styled-components'
import { FlexRow } from '../styles'

export const ModalContainer = styled.div<{
	top?: string
	bottom?: string
	left?: string
	right?: string
	zIndex?: number
}>`
	z-index: ${({ zIndex }) => zIndex || 1001};

	display: flex;
	flex-direction: column;
	gap: 0px;

	position: fixed;
	${({ top, bottom, left, right }) => {
		let out = ''

		if (top) {
			out += top
		} else if (bottom) {
			out += bottom
		} else {
			out += 'top: 50%;'
		}

		if (left) {
			out += left
		} else if (right) {
			out += right
		} else {
			out += 'left: 50%'
		}

		if (!top && !bottom && !left && !right) {
			out += 'transform: translate(-50%, -50%);'
		}

		return out
	}}

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
