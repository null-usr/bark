import React from 'react';
import Canvas from './canvas/Canvas';
import Palette from './palette/Palette';
import { WorkspaceContainer } from './styles';

const Workspace: React.FC<{}> = (props) => {
    const onDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        nodeType: string
    ) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <WorkspaceContainer>
            <Palette>
                <div className="description">
                    You can drag these nodes to the pane on the right.
                </div>
                <div
                    className="node react-flow__node-input"
                    onDragStart={(event) => onDragStart(event, 'input')}
                    draggable
                >
                    Input Node
                </div>
                <div
                    className="node react-flow__node-default"
                    onDragStart={(event) => onDragStart(event, 'default')}
                    draggable
                >
                    Default Node
                </div>
                <div
                    className="node react-flow__node-output"
                    onDragStart={(event) => onDragStart(event, 'output')}
                    draggable
                >
                    Output Node
                </div>
                <div
                    className="node react-flow__node-output"
                    onDragStart={(event) => onDragStart(event, 'dialogue')}
                    draggable
                >
                    Dialogue Node
                </div>
            </Palette>
            <Canvas />
        </WorkspaceContainer>
    );
};

export default Workspace;
