import React, { useRef } from 'react'
import styled from 'styled-components'

const StyledSpan = styled.span<{
	width?: string
	height?: string
}>`
	border-radius: 50%;
	cursor: pointer;
	border: 2px solid rgb(153, 153, 153);
	width: ${({ width }) => width || '100%'};
	height: ${({ height }) => height || '100%'};
	background-color: ${(props) => props.color || 'red'};
	display: inline-block;
`

const StyledInput = styled.input<{
	width?: string
}>`
	border-radius: 50%;
	inline-size: ${({ width }) => width || '100%'};
	block-size: ${({ width }) => width || '100%'};
	padding: 1px;
	border-width: 1px;
	border-style: solid;
	border-color: rgb(153, 153, 153);
	cursor: pointer;

	&::-webkit-color-swatch-wrapper {
		padding: 1px;
	}

	&::-webkit-color-swatch {
		border-radius: 50%;
	}
	&::-moz-color-swatch {
		border-radius: 50%;
	}
`

const ColorInput: React.FC<{
	value: string
	width?: string
	height?: string
	onChange?: (a0: string) => void
}> = ({ value, width, height, onChange }) => {
	const colorInputRef = useRef(null)

	const handleColorChange = (event: { target: { value: any } }) => {
		const newColor = event.target.value
		// eslint-disable-next-line no-unused-expressions
		onChange && onChange(newColor)
	}

	const handleSpanClick = () => {
		// @ts-ignore
		colorInputRef.current?.click()
	}
	return (
		<>
			{/* <StyledSpan
				className="nodrag"
				width={width}
				height={height}
				color={value}
				onClick={handleSpanClick}
			/> */}
			<StyledInput
				width={width}
				type="color"
				value={value}
				ref={colorInputRef}
				onChange={handleColorChange}
			/>
		</>
	)
}

export default ColorInput
