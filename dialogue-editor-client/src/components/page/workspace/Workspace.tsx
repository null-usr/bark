import React from 'react'
import Canvas from './canvas/Canvas'
import NodeGroup from './palette/NodeGroup'
import Palette from './palette/Palette'
import { WorkspaceContainer } from './styles'

const Workspace: React.FC<{}> = (props) => {
    return (
        <WorkspaceContainer>
            <Palette>
                <div className="description">
                    You can drag these nodes to the pane on the right.
                </div>
                <NodeGroup title="Basic Nodes" source="./builtin.json" />
                <NodeGroup title="Custom nodes" source="./custom.json" />
            </Palette>
            <Canvas />
        </WorkspaceContainer>
    )
}

export default Workspace
