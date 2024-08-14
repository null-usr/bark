import styled from 'styled-components'

export const WorkspaceContainer = styled.div`
	display: flex;
	flex-direction: row;

	min-height: 0px;

	// width: 100%;

	flex: 1;

	.reactflow-wrapper {
		flex-grow: 1;
		height: 100%;
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
