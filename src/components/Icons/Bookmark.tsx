import React from 'react'

import { Icon, Svg } from '@/components/Icons/SVG'

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
			d="M9 6C8.73478 6 8.48043 6.10536 8.29289 6.29289C8.10536 6.48043 8 6.73478 8 7V21.0568L13.4188 17.1863C13.7665 16.9379 14.2335 16.9379 14.5812 17.1863L20 21.0568V7C20 6.73478 19.8946 6.48043 19.7071 6.29289C19.5196 6.10536 19.2652 6 19 6H9ZM6.87868 4.87868C7.44129 4.31607 8.20435 4 9 4H19C19.7956 4 20.5587 4.31607 21.1213 4.87868C21.6839 5.44129 22 6.20435 22 7V23C22 23.3746 21.7907 23.7178 21.4576 23.8892C21.1245 24.0606 20.7236 24.0315 20.4188 23.8137L14 19.2289L7.58124 23.8137C7.27642 24.0315 6.87549 24.0606 6.54242 23.8892C6.20935 23.7178 6 23.3746 6 23V7C6 6.20435 6.31607 5.44129 6.87868 4.87868Z"
			fill="currentcolor"
		/>
	</Svg>
)

const BookmarkIcon: React.FC<{
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

export default BookmarkIcon
