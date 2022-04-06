/*
    Object would just be a react-flow handle to another node
*/

import React from 'react'

export const ObjectField: React.FC<{ key: string; value?: string }> = ({
	key,
	value,
}) => {
	return (
		<div>
			{key}:{value}
		</div>
	)
}
