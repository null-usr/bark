import styled from 'styled-components'

export const PaletteContainer = styled.div`
	/* height: 70vh; */
	width: 300px;

	overflow-y: auto;

	display: flex;
	flex-direction: column;
	justify-content: centered;

	border-right: 1px solid #404040;
	// padding: 15px 10px;
	font-size: 12px;
	color: white;
	background: ${(props) => props.theme.secondaryBg};

	@media screen and (min-width: 768px) {
		//width: 20%;
		//max-width: 180px;
	}

	.node {
		margin-bottom: 10px;
		cursor: grab;
	}

	.description {
		margin-bottom: 10px;
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

export const SceneContainer = styled.div<{ active?: boolean }>`
	box-sizing: border-box;
	padding: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	cursor: pointer;

	background-color: ${(props) => props.theme.nodeBg};

	height: 50px;
	border-radius: 3px;
	border: 1px solid
		${({ active, ...props }) =>
			active ? `${props.theme.primary}` : '#fcfcfc'};
`

export const NodeContainer = styled.div<{ color?: string; active?: boolean }>`
	display: grid;
	align-content: center;

	cursor: pointer;

	background-color: ${({ color, ...props }) => color || props.theme.nodeBg};

	min-height: 50px;
	border-radius: 3px;
	border: 1px solid
		${({ active, ...props }) =>
			active ? `${props.theme.primary}` : '#fcfcfc'};

	&:hover {
		border: 1px solid ${(props) => props.theme.primary};
	}
`

export const Group = styled.div`
	// pointer-events: none;
`
