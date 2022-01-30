import React from 'react'

export const BooleanField: React.FC<{ key: string; value?: boolean }> = ({
    key,
    value,
}) => {
    return (
        <div>
            {key}:{value}
        </div>
    )
}
