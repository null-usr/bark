import React from 'react'

import { Icon, Svg } from '../SVG'

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
			d="M3 14C3 7.92487 7.92487 3 14 3C20.0751 3 25 7.92487 25 14C25 20.0751 20.0751 25 14 25C7.92487 25 3 20.0751 3 14Z"
			fill="currentcolor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14 9C14.5523 9 15 9.44772 15 10V14C15 14.5523 14.5523 15 14 15C13.4477 15 13 14.5523 13 14V10C13 9.44772 13.4477 9 14 9Z"
			fill="white"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14 19C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17C13.4477 17 13 17.4477 13 18C13 18.5523 13.4477 19 14 19Z"
			fill="white"
		/>
	</Svg>
)

const WarningIcon: React.FC<{
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

export default WarningIcon
