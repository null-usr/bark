import React from 'react'
// import { PaletteContainer } from './styles'

const PaletteItem: React.FC<{
    classname: string
    name: string
    type: string
}> = ({ classname, name, type, ...props }) => {
    const onDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        nodeType: string
    ) => {
        event.dataTransfer.setData('application/reactflow', nodeType)
        event.dataTransfer.effectAllowed = 'move'
    }

    return (
        <div
            draggable="true"
            className={classname}
            onDragStart={(event) => onDragStart(event, type)}
        >
            {name}
        </div>
    )
}

export default PaletteItem
