import React from 'react';

import AudioAnimation from './AudioAnimation';

import Slider from '@material-ui/lab/Slider';
import { withStyles } from '@material-ui/core/styles';

const styles = {
	root   : {
		width : 300
	},
	slider : {
		'margin-top' : '100px',
		width        : '80%',
		margin       : '0 auto',
		padding      : '22px 0px'
	}
};

class AudioAnalyser extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			audioData         : new Uint8Array(0),
			maxVol            : 130,
			violations        : 0,
			threshDescription : 'A whisper will trigger me',
			first             : false,
			second            : false,
			count             : 0,
			timeOut           : 10
		};

		this.tick = this.tick.bind(this);
	}

	componentDidMount() {
		this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
		this.analyser = this.audioContext.createAnalyser();
		this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
		this.source = this.audioContext.createMediaStreamSource(this.props.audio);
		this.source.connect(this.analyser);
		this.rafId = requestAnimationFrame(this.tick);
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.rafId);
		this.analyser.disconnect();
		this.source.disconnect();
	}

	timer = () => {
		let time = new Date().getMilliseconds();

		if (time > 980) {
			console.log('plus 1');
			this.setState({ count: this.state.count + 1 });
		}
		if (this.state.count === this.state.timeOut) {
			console.log('animate 1st');
			this.setState({
				first : true
			});
		}
		if (this.state.count === this.state.timeOut * 2) {
			console.log('animate 2nd');
			this.setState({
				second : true,
				count  : 0
			});
		}
		console.log(this.state.count, time);
		console.log('*******', this.state.timeOut);
	};

	tick = () => {
		this.analyser.getByteTimeDomainData(this.dataArray);
		this.setState({ audioData: this.dataArray });
		this.rafId = requestAnimationFrame(this.tick);
		if (Math.max.apply(Math, this.state.audioData) > this.state.maxVol) {
			this.setState({
				violations : this.state.violations + 1,
				first      : false,
				second     : false,
				count      : 0
			});

			// this.rafId = requestAnimationFrame(this.tick);

			// window.setTimeout(
			// 	function() {
			// 		this.setState({
			// 			shh : false
			// 		});
			// 	}.bind(this),
			// 	1000
			// );
			// time = 0;
		} else {
			this.timer();
			// window.setTimeout(
			// 	function() {
			// 		console.log('true timeout');
			// 		this.setState({
			// 			shh : true
			// 		});
			// 	}.bind(this),
			// 	5000
			// );
			// this.rafId = requestAnimationFrame(this.tick);
		}
	};

	timerChanges = (e) => {
		// e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	handleChange = (e, value) => {
		this.setState(
			{
				maxVol : value
			},
			() => {
				if (this.state.maxVol < 135) {
					this.setState({ threshDescription: 'A whisper will trigger me' });
				} else if (this.state.maxVol > 135 && this.state.maxVol < 150) {
					this.setState({ threshDescription: 'Light Talking' });
				} else if (this.state.maxVol > 150 && this.state.maxVol < 200) {
					this.setState({ threshDescription: 'Maybe a raised voice' });
				} else if (this.state.maxVol > 200 && this.state.maxVol < 250) {
					this.setState({ threshDescription: 'Enough to give me a headache' });
				} else if (this.state.maxVol > 250 && this.state.maxVol < 299) {
					this.setState({ threshDescription: 'Jet airplane in your ear' });
				} else if (this.state.maxVol > 299) {
					this.setState({ threshDescription: 'Good luck setting me off' });
				}
			}
		);
	};

	render() {
		const { classes } = this.props;

		return (
			<div>
				<AudioAnimation first={this.state.first} second={this.state.second} />

				<div>This counter will go up if you are too loud!!! {this.state.violations}</div>
				<div>Threshold: {this.state.threshDescription} </div>

				<Slider
					className={classes.slider}
					value={this.state.maxVol}
					aria-labelledby="label"
					onChange={this.handleChange}
					min={130}
					max={300}
				/>
				<div className="levels" />

				<input type="number" onChange={this.timerChanges} name="timeOut" value={this.state.timeOut} />
			</div>
		);
	}
}

export default withStyles(styles)(AudioAnalyser);
// export default AudioAnalyser;
