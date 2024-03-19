import styled from 'styled-components'

export const ModalContainer = styled.div<{
	zIndex?: number
}>`
	z-index: ${({ zIndex }) => zIndex || 1001};

	padding: 16px;

	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: ${(props) => props.theme.secondaryBg};
	border: 1px solid white;
	border-radius: 2px;
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
