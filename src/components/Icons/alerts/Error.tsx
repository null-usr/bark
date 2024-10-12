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
			d="M17.7071 10.2929C18.0976 10.6834 18.0976 11.3166 17.7071 11.7071L11.7071 17.7071C11.3166 18.0976 10.6834 18.0976 10.2929 17.7071C9.90237 17.3166 9.90237 16.6834 10.2929 16.2929L16.2929 10.2929C16.6834 9.90237 17.3166 9.90237 17.7071 10.2929Z"
			fill="white"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M10.2929 10.2929C10.6834 9.90237 11.3166 9.90237 11.7071 10.2929L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071C17.3166 18.0976 16.6834 18.0976 16.2929 17.7071L10.2929 11.7071C9.90237 11.3166 9.90237 10.6834 10.2929 10.2929Z"
			fill="white"
		/>
	</Svg>
)

const ErrorIcon: React.FC<{
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

export default ErrorIcon
