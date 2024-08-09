import React from 'react'

import { Icon, Svg } from './SVG'

const SVG: React.FC<{ styleString?: string }> = ({ styleString }) => (
	<Svg
		width="100%"
		height="100%"
		viewBox="0 0 28 28"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		styleString={styleString}
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M20.7071 17.7071C20.3166 18.0976 19.6834 18.0976 19.2929 17.7071L14 12.4142L8.70711 17.7071C8.31658 18.0976 7.68342 18.0976 7.29289 17.7071C6.90237 17.3166 6.90237 16.6834 7.29289 16.2929L13.2929 10.2929C13.6834 9.90237 14.3166 9.90237 14.7071 10.2929L20.7071 16.2929C21.0976 16.6834 21.0976 17.3166 20.7071 17.7071Z"
			fill="currentcolor"
		/>
	</Svg>
)

const ChevronUpIcon: React.FC<{
	width?: number
	height?: number
	color?: string
	hover?: string
	active?: string
}> = ({ width = 24, height = 24, color, hover, active }) => {
	return (
		<Icon
			width={width}
			height={height}
			Component={SVG}
			color={color}
			hover={hover}
			active={active}
		/>
	)
}

export default ChevronUpIcon
