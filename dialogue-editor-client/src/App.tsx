import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import ReactFlow, {
  removeElements,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Elements
} from 'react-flow-renderer';
import initialElements from './initial-elements';

function onLoad(reactFlowInstance: any) {
  reactFlowInstance.fitView();
}

function App() {
  const [elements, setElements] = useState(initialElements);
  const onElementsRemove = (elementsToRemove: Elements<any>) =>
    setElements((els: any) => removeElements(elementsToRemove, els));
  const onConnect = (params: any) => setElements((els: any) => addEdge(params, els));

  return (
    <ReactFlow
      elements={elements}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onLoad={onLoad}
      snapToGrid={true}
      snapGrid={[15, 15]}
      style={{ height: 1000, width: 1000 }}
    >
      <MiniMap
        nodeStrokeColor={(n) => {
          if (n.style?.background) return n.style.background as string;
          if (n.type === 'input') return '#0041d0';
          if (n.type === 'output') return '#ff0072';
          if (n.type === 'default') return '#1a192b';

          return '#eee';
        }}
        nodeColor={(n) => {
          if (n.style?.background) return n.style.background as string;

          return '#fff';
        }}
        nodeBorderRadius={2}
      />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
}

export default App;
