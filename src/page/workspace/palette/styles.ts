import styled from 'styled-components'

export const PaletteContainer = styled.div`
	// height: 100%;
	width: 300px;

	overflow-y: auto;

	display: flex;
	flex-direction: column;
	justify-content: centered;

	border-right: 1px solid #eee;
	// padding: 15px 10px;
	font-size: 12px;
	color: white;
	background: ${(props) => props.theme.bg};

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

export const SceneContainer = styled.div<{ active?: boolean }>`
	display: grid;
	justify-content: center;
	align-content: center;

	cursor: pointer;

	height: 50px;
	border-radius: 6px;
	border: 1px solid
		${({ active, ...props }) =>
			active ? `${props.theme.primary}` : '#fcfcfc'};
`

export const NodeContainer = styled.div<{ color?: string; active?: boolean }>`
	display: grid;
	justify-content: center;
	align-content: center;

	cursor: pointer;

	background-color: ${({ color }) => color || 'white'};

	min-height: 50px;
	border-radius: 6px;
	border: 2px solid
		${({ active, ...props }) =>
			active ? `${props.theme.primary}` : '#fcfcfc'};

	&:hover {
		border: 2px solid blue;
	}
`

export const Group = styled.div`
	// pointer-events: none;
`
