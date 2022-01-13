import styled from 'styled-components'

export const HeaderContainer = styled.div<{
    background?: string
}>`
    // width: 100%;
    background: ${({ background }) => background || 'grey'};
    color: white;
    padding: 20px;
`
