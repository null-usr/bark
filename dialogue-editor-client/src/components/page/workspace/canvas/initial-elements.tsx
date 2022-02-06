import { Elements } from 'react-flow-renderer'
import DialogueNode from '../../../../helpers/DialogueNode'
import DialogueEdge from '../../../../helpers/DialogueEdge'
import StartNode from '../../../../helpers/StartNode'

const initialElements: Elements<any> = [
    new StartNode(),
    // new DialogueNode('Character 1', 'Hello world!', 100, 200),
    // new DialogueNode('World', "What's up?", 100, 400),
    new DialogueEdge('0', '1'),
    new DialogueEdge('1', '2'),
]

export default initialElements
