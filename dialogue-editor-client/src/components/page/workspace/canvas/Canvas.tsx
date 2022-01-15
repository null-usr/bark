import React, { useRef, useState } from 'react';
import Modal from 'react-modal';
import ReactFlow, {
    ReactFlowProvider,
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
    Elements,
} from 'react-flow-renderer';
import DialogueNode from '../../../../helpers/DialogueNode';
import DialogueForm from '../../../../helpers/DialogueForm';
import initialElements from './initial-elements';
import { AddButton, CanvasContainer } from './styles';

// styles for the modal
const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
    },
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const Canvas: React.FC<{}> = (props) => {
    // for modal
    const [modalIsOpen, setIsOpen] = React.useState(false);
    // on add option click, open the modal
    function addOption(event: any) {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const reactFlowWrapper = useRef<any>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    function onLoad(_reactFlowInstance: any) {
        _reactFlowInstance.fitView();
        setReactFlowInstance(_reactFlowInstance);
    }

    const [elements, setElements] = useState(initialElements);
    const onElementsRemove = (elementsToRemove: Elements<any>) =>
        setElements((els: any) => removeElements(elementsToRemove, els));
    const onConnect = (params: any) =>
        setElements((els: any) => addEdge(params, els));

    const submitModal = (event: any) => {
        closeModal();
        if (
            event == null ||
            event.character_name == null ||
            event.character_name === '' ||
            event.dialog == null ||
            event.dialog === ''
        )
            return;
        setElements((els: any[]) => {
            const elems = [...els];
            elems.push(
                new DialogueNode(event.character_name, event.dialog, 250, 250)
            );
            console.log(elems);
            return elems;
        });
    };

    // ====================== DRAG & DROP BEHAVIOUR ===============================
    const onDragOver = (event: {
        preventDefault: () => void;
        dataTransfer: { dropEffect: string };
    }) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    const onDrop = (event: {
        preventDefault: () => void;
        dataTransfer: { getData: (arg0: string) => any };
        clientX: number;
        clientY: number;
    }) => {
        event.preventDefault();

        if (reactFlowWrapper == null || reactFlowInstance == null) {
            return;
        }

        const reactFlowBounds =
            reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData('application/reactflow');
        const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });
        const newNode = {
            id: getId(),
            type,
            position,
            data: { label: `${type} node` },
        };

        setElements((es) => es.concat(newNode));
    };

    Modal.setAppElement('#root');

    return (
        <CanvasContainer>
            <Modal
                isOpen={modalIsOpen}
                // react/jsx-no-bind, JSX props should not use functions
                onRequestClose={closeModal}
                style={customModalStyles}
                contentLabel="Add Dialogue Option"
            >
                <button onClick={closeModal}>close</button>
                <DialogueForm callback={submitModal} />
            </Modal>
            <ReactFlowProvider>
                <div
                    style={{ width: '100%', height: '100%' }}
                    className="reactflow-wrapper"
                    ref={reactFlowWrapper}
                >
                    <ReactFlow
                        elements={elements}
                        onElementsRemove={onElementsRemove}
                        onConnect={onConnect}
                        onLoad={onLoad}
                        onDragOver={onDragOver}
                        onDrop={onDrop}
                        snapToGrid
                        snapGrid={[15, 15]}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                    >
                        <MiniMap
                            nodeStrokeColor={(n) => {
                                if (n.style?.background)
                                    return n.style.background as string;
                                if (n.type === 'input') return '#0041d0';
                                if (n.type === 'output') return '#ff0072';
                                if (n.type === 'default') return '#1a192b';

                                return '#1a192b';
                            }}
                            nodeColor={(n) => {
                                if (n.style?.background)
                                    return n.style.background as string;

                                return '#fff';
                            }}
                            nodeBorderRadius={2}
                        />
                        <Controls />
                        <Background color="#aaa" gap={16} />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
            <AddButton z={1} onClick={addOption}>
                Add Dialogue Option
            </AddButton>
        </CanvasContainer>
    );
};

export default Canvas;
