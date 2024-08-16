import styled from 'styled-components'

export const ImageContainer = styled.div<{
	src: string
	width: string
	height: string
}>`
	background-image: url(${({ src }) => src});
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;
	width: ${({ width }) => width || '100%'};
	height: ${({ height }) => height || '100%'};
`
