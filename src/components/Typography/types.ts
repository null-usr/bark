export interface TypographyProps {
	color?: string
	weight?: number
	letterSpacing?: number
	children?: any
}

export interface ParagraphProps extends TypographyProps {
	size?: number
}

export interface TextProps extends TypographyProps {
	inline?: boolean
	size?: number
	weight?: number
}

export interface CaptionProps extends TypographyProps {
	weight?: number
}
