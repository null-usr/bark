import { ArrowHeadType } from 'react-flow-renderer';

class DialogueEdge {
	readonly id: string;
	readonly source: string;
	readonly target: string;
	readonly arrowHeadType: ArrowHeadType = ArrowHeadType.ArrowClosed;

	constructor(source: string, target: string) {
		this.source = source;
		this.target = target;
		this.id = `${source}-${target}`;
	}
}

export default DialogueEdge;