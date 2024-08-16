import styled from 'styled-components'

export const AppContainer = styled.div`
	height: 100vh;
	max-height: 100vh;
	overflow: hidden;

	/* override react-flow to force nodes to be below edges */
	&.react-flow__node {
		/* z-index: -1 !important; */
	}

	.react-flow__edges,
	.react-flow__edge-path {
		/* z-index: 1001 !important; */
	}

	.react-flow__nodesselection-rect {
		/* display: none; */
		background: rgba(0, 89, 220, 0.08);
		border: 1px dotted green;
	}

	/* width */
	*::-webkit-scrollbar {
		width: 10px;
	}

	/* Track */
	*::-webkit-scrollbar-track {
		background: #000000;
	}

	/* Handle */
	*::-webkit-scrollbar-thumb {
		background: #463f43;
	}

	/* Handle on hover */
	*::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`
