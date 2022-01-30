import React from 'react'

export const ArrayField: React.FC<{ key: string; value?: [] }> = ({
    key,
    value,
}) => {
    return (
        <div>
            {key}:{value}
        </div>
    )
}
