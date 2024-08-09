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
			d="M7 14C6.44772 14 6 14.4477 6 15V22C6 22.5523 6.44772 23 7 23H21C21.5523 23 22 22.5523 22 22V15C22 14.4477 21.5523 14 21 14H7ZM4 15C4 13.3431 5.34315 12 7 12H21C22.6569 12 24 13.3431 24 15V22C24 23.6569 22.6569 25 21 25H7C5.34315 25 4 23.6569 4 22V15Z"
			fill="currentcolor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M14 5C12.9391 5 11.9217 5.42143 11.1716 6.17157C10.4214 6.92172 10 7.93913 10 9V13C10 13.5523 9.55228 14 9 14C8.44772 14 8 13.5523 8 13V9C8 7.4087 8.63214 5.88258 9.75736 4.75736C10.8826 3.63214 12.4087 3 14 3C15.5913 3 17.1174 3.63214 18.2426 4.75736C19.3679 5.88258 20 7.4087 20 9V13C20 13.5523 19.5523 14 19 14C18.4477 14 18 13.5523 18 13V9C18 7.93913 17.5786 6.92172 16.8284 6.17157C16.0783 5.42143 15.0609 5 14 5Z"
			fill="currentcolor"
		/>
	</Svg>
)

const LockIcon: React.FC<{
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

export default LockIcon
