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
			d="M18.7559 10.2441C19.0814 10.5695 19.0814 11.0972 18.7559 11.4226L12.9226 17.2559C12.5972 17.5814 12.0695 17.5814 11.7441 17.2559L9.24408 14.7559C8.91864 14.4305 8.91864 13.9028 9.24408 13.5774C9.56951 13.252 10.0972 13.252 10.4226 13.5774L12.3333 15.4882L17.5774 10.2441C17.9028 9.91864 18.4305 9.91864 18.7559 10.2441Z"
			fill="white"
		/>
	</Svg>
)

const SuccessIcon: React.FC<{
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

export default SuccessIcon
