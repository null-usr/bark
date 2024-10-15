import styled from 'styled-components'
import mediaQueries from './mediaQueries'

export const Desktop = styled.div`
	display: none;
	@media ${mediaQueries.laptop.small} {
		display: contents;
	}
`
export const Mobile = styled.div`
	display: contents;
	@media ${mediaQueries.laptop.small} {
		display: none;
	}
`
