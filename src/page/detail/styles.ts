import { FlexColumn } from '@/components/styles'
import styled from 'styled-components'

export const Container = styled.div<{
	zIndex?: number
}>`
	display: flex;
	gap: 16px;
	align-items: center;
	flex-direction: column;

	width: 50vw;
	height: 100%;
`

export const DataContainer = styled(FlexColumn)`
	height: 100%;
	width: 100%;
	overflow: auto;
	align-items: center;
	flex: 1;
`
