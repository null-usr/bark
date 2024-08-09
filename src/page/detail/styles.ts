import { FlexColumn, FlexRow } from '@/components/styles'
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
	box-sizing: border-box;
	padding: 8px;
	height: 100%;
	width: 100%;
	gap: 16px;
	overflow: auto;
	align-items: center;
	flex: 1;
`

export const ItemContainer = styled(FlexRow)`
	box-sizing: border-box;
	justify-content: center;
	border: 1px solid gray;
	padding: 16px;
	width: 100%;
`
