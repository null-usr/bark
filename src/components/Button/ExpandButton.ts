import colors from '@/helpers/theme/colors'
import styled from 'styled-components'

const ExpandButton = styled.div<{
	background?: string
	hover?: string
	border?: string
}>`
	display: grid;
	justify-content: center;
	align-content: center;
	cursor: pointer;
	width: 100%;

	padding: 4px;

	background-color: ${({ background }) => `${background || colors.gray[10]}`};

	border-radius: 3px;
	border: 1px solid ${({ border }) => border || colors.gray[80]};

	&:hover {
		background-color: ${({ hover }) => `${hover || colors.gray[20]}`};
	}
`

export default ExpandButton
