/*
    Object would just be a react-flow handle to another node
*/

import React, { useState } from 'react'
import { FieldContainer } from './styles'

export const StringField: React.FC<{
    k: string
    v: string
    index: number
    updateField(index: number, k: string, v: string): void
    del?(k: string): void
}> = ({ k, v, index, updateField, del }) => {
    // const [key, setKey] = useState<string>(k)
    // const [value, setValue] = useState<string | undefined>(v)

    return (
        <FieldContainer>
            <input
                type="text"
                value={k}
                onChange={(e) => updateField(index, e.target.value, v)}
            />
            :
            <input
                type="text"
                value={v}
                onChange={(e) => updateField(index, k, e.target.value)}
            />
            <button onClick={del ? () => del(k) : undefined}>Delete</button>
        </FieldContainer>
    )
}
