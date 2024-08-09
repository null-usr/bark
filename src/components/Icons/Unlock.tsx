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
			d="M19.9657 24H6.0343C4.36124 24 3 22.6424 3 20.9737V14.0263C3 12.3576 4.36124 11 6.0343 11H19.9657C21.6388 11 23 12.3576 23 14.0263V20.9737C23 22.6424 21.6388 24 19.9657 24ZM6.0343 13.0829C5.5125 13.0829 5.08814 13.5061 5.08814 14.0265V20.9739C5.08814 21.4944 5.5125 21.9176 6.0343 21.9176H19.9657C20.4875 21.9176 20.9119 21.4944 20.9119 20.9739V14.0265C20.9119 13.5061 20.4875 13.0829 19.9657 13.0829H6.0343Z"
			fill="currentcolor"
		/>
		<path
			d="M8.04935 13C7.46988 13 7 12.5346 7 11.9606V7.9979C6.9986 6.50993 7.55266 5.08132 8.56026 3.97631C9.56763 2.8713 10.9462 2.18021 12.4419 2.03053C13.9376 1.88086 15.4276 2.28484 16.6381 3.16788C17.8486 4.05115 18.6799 5.34117 18.9788 6.80027C19.094 7.36294 18.7272 7.91151 18.1592 8.02562C17.5911 8.13995 17.0373 7.77639 16.9221 7.21372C16.7267 6.2607 16.1839 5.41832 15.3934 4.84133C14.6028 4.26457 13.6295 4.00079 12.6527 4.0985C11.6759 4.1962 10.7755 4.64754 10.1175 5.36912C9.45943 6.09093 9.09752 7.02386 9.09846 7.99628V11.9599C9.09846 12.5339 8.62858 12.9993 8.04911 12.9993L8.04935 13Z"
			fill="currentcolor"
		/>
	</Svg>
)

const UnlockIcon: React.FC<{
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

export default UnlockIcon
