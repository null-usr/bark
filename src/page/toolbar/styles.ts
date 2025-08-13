import { Base } from '@/components/Button/styles'
import { Paragraph } from '@/components/Typography/text'
import styled from 'styled-components'

export const HeaderContainer = styled.div<{
	background?: string
}>`
	// width: 100%;
	background: ${(props) => props.theme.secondaryBg || 'grey'};
	color: white;
	padding: 0px;
	height: 45px;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	border-bottom: 1px solid ${(props) => props.theme.controlsBorder};
`
export const LeftButtonGroup = styled.div<{}>`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 10px;

	* {
		cursor: pointer;
	}
`

export const RightButtonGroup = styled.div<{}>`
	display: flex;
	flex-direction: row-reverse;
	gap: 10px;

	* {
		cursor: pointer;
	}
`

export const ToolbarContent = styled.div<{ z?: number }>`
	display: none;
	position: absolute;
	background-color: #f9f9f9;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
	z-index: ${({ z }) => z || 1};

	/* *:hover {
		background-color: #f1f1f1;
	} */

	${Base} {
		background: ${(props) => props.theme.bg};
		${Paragraph} {
			color: white;
		}
	}
`

export const ToolbarLabel = styled.div`
	display: grid;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	background: ${(props) => props.theme.secondaryBg};
	border-right: 1px solid ${(props) => props.theme.bg};
	min-width: 100px;
	height: 100%;
	color: white;
	padding: 5px;
	border: none;
	cursor: pointer;

	${Paragraph} {
		color: white;
	}
`

export const ToolbarButtonContainer = styled.div`
	position: relative;
	display: inline-block;

	&:hover {
		${ToolbarLabel} {
			background: ${(props) => props.theme.bg};
		}

		${ToolbarContent} {
			display: flex;
			flex-direction: column;
		}
	}
`
