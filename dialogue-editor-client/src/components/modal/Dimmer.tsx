import { MouseEventHandler } from 'react'
import styled from 'styled-components'

const Dimmer = styled.div<{
    isOpen: boolean
    onClick: MouseEventHandler<HTMLElement> | undefined
    zIndex?: number
}>`
    display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
    position: fixed;
    z-index: ${({ zIndex }) => zIndex || 1000};
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
`

export default Dimmer
