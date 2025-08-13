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
			d="M7.29289 10.2929C7.68342 9.90237 8.31658 9.90237 8.70711 10.2929L14 15.5858L19.2929 10.2929C19.6834 9.90237 20.3166 9.90237 20.7071 10.2929C21.0976 10.6834 21.0976 11.3166 20.7071 11.7071L14.7071 17.7071C14.3166 18.0976 13.6834 18.0976 13.2929 17.7071L7.29289 11.7071C6.90237 11.3166 6.90237 10.6834 7.29289 10.2929Z"
			fill="currentColor"
		/>
	</Svg>
)

const ChevronDownIcon: React.FC<{
	width?: number
	className?: string
	height?: number
	color?: string
	hover?: string
	active?: string
}> = ({ width = 24, height = 24, color, hover, active, className }) => {
	return (
		<Icon
			className={className}
			width={width}
			height={height}
			Component={SVG}
			color={color}
			hover={hover}
			active={active}
		/>
	)
}

export default ChevronDownIcon
