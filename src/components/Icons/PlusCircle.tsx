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
			d="M14 5C9.02944 5 5 9.02944 5 14C5 18.9706 9.02944 23 14 23C18.9706 23 23 18.9706 23 14C23 9.02944 18.9706 5 14 5ZM3 14C3 7.92487 7.92487 3 14 3C20.0751 3 25 7.92487 25 14C25 20.0751 20.0751 25 14 25C7.92487 25 3 20.0751 3 14Z"
			fill="currentcolor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14 9C14.5523 9 15 9.44772 15 10V18C15 18.5523 14.5523 19 14 19C13.4477 19 13 18.5523 13 18V10C13 9.44772 13.4477 9 14 9Z"
			fill="currentcolor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M9 14C9 13.4477 9.44772 13 10 13H18C18.5523 13 19 13.4477 19 14C19 14.5523 18.5523 15 18 15H10C9.44772 15 9 14.5523 9 14Z"
			fill="currentcolor"
		/>
	</Svg>
)

const PlusCircleIcon: React.FC<{
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

export default PlusCircleIcon
