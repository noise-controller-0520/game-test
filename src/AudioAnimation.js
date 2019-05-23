import React from 'react';
import { CSSTransition } from 'react-transition-group';

import logo from './logo.svg';
import bush from './bush.png';
import './App.css';

// function App() {
// 	return (
// 		<div className="App">
// 			<img src={logo} className="App-logo" alt="logo" />

// 			<img src={bush} className="bush" alt="bush" />

// 			<Animation />
// 		</div>
// 	);
// }

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inProp : false
		};
	}
	// const [ inProp, setInProp ] = useState(false);

	toggleinProp() {
		this.setState({
			first : !this.state.first
		});
	}

	render() {
		return (
			<div className="jungle">
				<div className="bottom-left">
					<CSSTransition in={this.props.first} timeout={1000} classNames="my-node">
						<div>
							<img src={logo} className="App-logo my-node" alt="logo" />
						</div>
					</CSSTransition>
				</div>
				<div className="bottom-right">
					<CSSTransition in={this.props.second} timeout={1000} classNames="new-node">
						<div>
							<img src={logo} className="App-logo new-node" alt="logo" />
						</div>
					</CSSTransition>
				</div>

				<img src={bush} className="bush" alt="bush" />

				<button type="button" onClick={() => this.toggleinProp()}>
					Click to Enter
				</button>
			</div>
		);
	}
}

export default App;
