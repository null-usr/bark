import styled from 'styled-components'

export const WorkspaceContainer = styled.div`
	display: flex;
	flex-direction: row;

	// width: 100%;

	flex: 1;

	.reactflow-wrapper {
		flex-grow: 1;
		height: 100%;
	}
`

export const TabLink = styled.button<{
	active: boolean
}>`
	background-color: ${({ active, ...props }) =>
		active ? props.theme.secondaryBg : props.theme.bg};
	color: white;
	float: left;
	border: none;
	outline: none;
	cursor: pointer;
	padding: 14px 16px;
	font-size: 17px;
	width: 50%;

	${({ active, ...props }) =>
		active && `border-top: 2px solid ${props.theme.primary};`}

	&:hover {
		background-color: ${({ active }) => (active ? '' : '#777')};
		color: ${({ active }) => (active ? '' : 'white')};
	}
`

export const BottomBar = styled.div`
	position: absolute;
	bottom: 20px;
	left: 0;
	right: 0;

	display: flex;
	gap: 8px;
	justify-content: center;
`
