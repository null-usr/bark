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
			d="M4 5C4 4.44772 4.44772 4 5 4H12C12.5523 4 13 4.44772 13 5V12C13 12.5523 12.5523 13 12 13H5C4.44772 13 4 12.5523 4 12V5ZM6 6V11H11V6H6Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M15 5C15 4.44772 15.4477 4 16 4H23C23.5523 4 24 4.44772 24 5V12C24 12.5523 23.5523 13 23 13H16C15.4477 13 15 12.5523 15 12V5ZM17 6V11H22V6H17Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M15 16C15 15.4477 15.4477 15 16 15H23C23.5523 15 24 15.4477 24 16V23C24 23.5523 23.5523 24 23 24H16C15.4477 24 15 23.5523 15 23V16ZM17 17V22H22V17H17Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M4 16C4 15.4477 4.44772 15 5 15H12C12.5523 15 13 15.4477 13 16V23C13 23.5523 12.5523 24 12 24H5C4.44772 24 4 23.5523 4 23V16ZM6 17V22H11V17H6Z"
			fill="currentColor"
		/>
	</Svg>
)

const FourSquaresIcon: React.FC<{
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

export default FourSquaresIcon
