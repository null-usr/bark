import styled from 'styled-components'

export const Container = styled.div<{
	zIndex?: number
}>`
	position: fixed;
	width: 50%;
	height: 50%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

	display: flex;
	flex-direction: column;
	//   align-items: center;
	//   justify-content: center;

	z-index: ${({ zIndex }) => zIndex || 10002};

	background-color: white;
`
