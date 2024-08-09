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
			d="M6 7C5.73478 7 5.48043 7.10536 5.29289 7.29289C5.10536 7.48043 5 7.73478 5 8V22C5 22.2652 5.10536 22.5196 5.29289 22.7071C5.48043 22.8946 5.73478 23 6 23H20C20.2652 23 20.5196 22.8946 20.7071 22.7071C20.8946 22.5196 21 22.2652 21 22V16.66C21 16.1077 21.4477 15.66 22 15.66C22.5523 15.66 23 16.1077 23 16.66V22C23 22.7957 22.6839 23.5587 22.1213 24.1213C21.5587 24.6839 20.7957 25 20 25H6C5.20435 25 4.44129 24.6839 3.87868 24.1213C3.31607 23.5587 3 22.7957 3 22V8C3 7.20435 3.31607 6.44129 3.87868 5.87868C4.44129 5.31607 5.20435 5 6 5H11.34C11.8923 5 12.34 5.44772 12.34 6C12.34 6.55228 11.8923 7 11.34 7H6Z"
			fill="currentColor"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M19.2929 3.29289C19.6834 2.90237 20.3166 2.90237 20.7071 3.29289L24.7071 7.29289C25.0976 7.68342 25.0976 8.31658 24.7071 8.70711L14.7071 18.7071C14.5196 18.8946 14.2652 19 14 19H10C9.44772 19 9 18.5523 9 18V14C9 13.7348 9.10536 13.4804 9.29289 13.2929L19.2929 3.29289ZM11 14.4142V17H13.5858L22.5858 8L20 5.41421L11 14.4142Z"
			fill="currentColor"
		/>
	</Svg>
)

const NotepadIcon: React.FC<{
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

export default NotepadIcon
