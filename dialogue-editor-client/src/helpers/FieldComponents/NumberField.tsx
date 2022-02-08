import React from 'react'

export const NumberField: React.FC<{ key: string; value?: number }> = ({
	key,
	value,
}) => {
	return (
		<div>
			{key}:{value}
		</div>
	)
}
