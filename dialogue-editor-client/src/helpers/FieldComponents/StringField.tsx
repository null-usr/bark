/*
    Object would just be a react-flow handle to another node
*/

import React, { useState } from 'react'
import { FieldContainer } from './styles'

export const StringField: React.FC<{
    k: string
    v?: string
    del?(k: string): void
}> = ({ k, v, del }) => {
    const [key, setKey] = useState<string>(k)
    const [value, setValue] = useState<string | undefined>(v)

    return (
        <FieldContainer>
            <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />
            :
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={del ? () => del(k) : undefined}>Delete</button>
        </FieldContainer>
    )
}
