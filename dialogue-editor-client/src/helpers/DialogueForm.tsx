import {Component} from 'react';

interface IProps {
	callback: (data: object) => void
}

interface IState {
	character_name: "",
	dialog: ""
}

class DialogueForm extends Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			character_name: "",
			dialog: ""
		};

		this.callback = props.callback;
		
		this.handleInputChange = this.handleInputChange.bind(this);
		this.submitModal = this.submitModal.bind(this);
	}

	callback: (data: object) => void;
	
	handleInputChange(event : any) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		
		switch (target.name) {
			case "character_name":
				this.setState({
					character_name: value
				});
				break;
			case "dialog":
				this.setState({
					dialog: value
				});
				break;
			default:
				throw new Error(`invalid target name ${target.name}`);
		}
	}

	submitModal(event: any) {
		event.preventDefault();
		this.callback(this.state);
	}

	render() {
		return (
			<form onSubmit={this.submitModal}>
				<input name="character_name" value={this.state.character_name} onChange={this.handleInputChange} />
				<textarea name="dialog" rows={5} value={this.state.dialog} onChange={this.handleInputChange} />
				<button type="submit">Add</button>
			</form>
		);
	}
}

export default DialogueForm;