import React, { ReactNode } from 'react'
import { Paragraph } from '@/components/Typography/text'
import colors from '@/helpers/theme/colors'
import { Primary, Secondary, Text, Subtle } from './styles'
import Spinner from '../Spinner'

export interface Props {
	children: ReactNode
	block?: boolean
	danger?: boolean
	disabled?: boolean
	loading?: boolean
	type?: 'primary' | 'secondary' | 'subtle' | 'text'
	icon?: ReactNode
	submitType?: 'button' | 'submit' | 'reset' | undefined
	onClick?: () => void
}

const Button: React.FC<Props> = ({
	children,
	block,
	danger,
	disabled,
	icon,
	submitType,
	loading,
	type = 'primary',
	onClick,
}) => {
	let Component = Primary

	switch (type) {
		case 'secondary':
			Component = Secondary
			break
		case 'subtle':
			Component = Subtle
			break
		case 'text':
			Component = Text
			break
		default:
			break
	}

	return (
		<Component
			type={submitType || 'button'}
			onClick={(e) => {
				e.stopPropagation()
				// eslint-disable-next-line no-unused-expressions
				onClick && onClick()
			}}
			block={block}
			danger={danger}
			disabled={disabled || loading}
		>
			{!loading && <>{icon}</>}
			{loading && (
				<Spinner
					color={danger ? `${colors.red[30]}` : `${colors.blue[40]}`}
					width={12}
					thickness={2}
				/>
			)}

			<Paragraph size={16}>{children}</Paragraph>
		</Component>
	)
}

export default Button
